// Backend API untuk CMS Website Kejaksaan Negeri Purbalingga.
//   node index.js            -> jalan di http://localhost:3001
//   node --watch index.js    -> mode dev (auto-reload)
import express from 'express'
import cors from 'cors'
import { randomBytes } from 'node:crypto'
import { db, hashPassword, verifyPassword, seedIfEmpty, runMigrations } from './db.js'

await runMigrations()
seedIfEmpty()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// ============ KONTEN PUBLIK (tanpa login) ============
app.get('/api/konten', (req, res) => {
  try {
    const berita = db.prepare('SELECT * FROM berita ORDER BY tanggal DESC, id DESC').all()
    const layanan = db.prepare('SELECT * FROM layanan ORDER BY id ASC').all()
    const testimoni = db.prepare('SELECT * FROM testimoni ORDER BY id ASC').all()
    const pengaturan = Object.fromEntries(
      db.prepare('SELECT kunci, nilai FROM pengaturan').all().map((r) => [r.kunci, r.nilai])
    )
    res.json({ berita, layanan, testimoni, pengaturan })
  } catch (e) {
    res.status(500).json({ error: 'Gagal membaca konten: ' + e.message })
  }
})

app.get('/api/kesehatan', (req, res) => res.json({ ok: true, waktu: new Date().toISOString() }))

// ============ AUTH ============
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}
  if (!username || !password) return res.status(400).json({ error: 'Username dan password wajib diisi' })
  const user = db.prepare('SELECT * FROM admin WHERE username = ?').get(String(username))
  if (!user || !verifyPassword(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'Username atau password salah' })
  }
  const token = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sesi (token, admin_id) VALUES (?, ?)').run(token, user.id)
  res.json({ token, username: user.username })
})

function butuhAuth(req, res, next) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const sesi = token ? db.prepare('SELECT * FROM sesi WHERE token = ?').get(token) : null
  if (!sesi) return res.status(401).json({ error: 'Sesi tidak valid — silakan login ulang' })
  req.adminId = sesi.admin_id
  req.token = token
  next()
}

app.post('/api/auth/logout', butuhAuth, (req, res) => {
  db.prepare('DELETE FROM sesi WHERE token = ?').run(req.token)
  res.json({ ok: true })
})

app.get('/api/auth/me', butuhAuth, (req, res) => {
  const user = db.prepare('SELECT username FROM admin WHERE id = ?').get(req.adminId)
  res.json({ username: user?.username ?? null })
})

// ============ CRUD ADMIN (generik, nama tabel hardcode -> aman dari injeksi) ============
function buatCrud(tabel, kolom) {
  const r = express.Router()
  r.use(butuhAuth)

  r.get('/', (req, res) => {
    res.json(db.prepare(`SELECT * FROM ${tabel} ORDER BY id DESC`).all())
  })

  r.post('/', (req, res) => {
    const nilai = kolom.map((k) => String(req.body?.[k] ?? ''))
    const info = db
      .prepare(`INSERT INTO ${tabel} (${kolom.join(', ')}) VALUES (${kolom.map(() => '?').join(', ')})`)
      .run(...nilai)
    res.status(201).json(db.prepare(`SELECT * FROM ${tabel} WHERE id = ?`).get(info.lastInsertRowid))
  })

  r.put('/:id', (req, res) => {
    const nilai = kolom.map((k) => String(req.body?.[k] ?? ''))
    db.prepare(`UPDATE ${tabel} SET ${kolom.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).run(
      ...nilai,
      req.params.id
    )
    const row = db.prepare(`SELECT * FROM ${tabel} WHERE id = ?`).get(req.params.id)
    if (!row) return res.status(404).json({ error: 'Data tidak ditemukan' })
    res.json(row)
  })

  r.delete('/:id', (req, res) => {
    const info = db.prepare(`DELETE FROM ${tabel} WHERE id = ?`).run(req.params.id)
    if (info.changes === 0) return res.status(404).json({ error: 'Data tidak ditemukan' })
    res.json({ ok: true })
  })

  return r
}

app.use('/api/admin/berita', buatCrud('berita', ['judul', 'ringkasan', 'gambar', 'tanggal']))
app.use('/api/admin/layanan', buatCrud('layanan', ['judul', 'deskripsi', 'gambar']))
app.use('/api/admin/testimoni', buatCrud('testimoni', ['nama', 'peran', 'kutipan']))

// ============ PENGATURAN (teks hero, tentang, CTA, alamat) ============
app.get('/api/admin/pengaturan', butuhAuth, (req, res) => {
  res.json(
    Object.fromEntries(db.prepare('SELECT kunci, nilai FROM pengaturan').all().map((r) => [r.kunci, r.nilai]))
  )
})

app.put('/api/admin/pengaturan', butuhAuth, (req, res) => {
  const up = db.prepare(
    'INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?) ON CONFLICT(kunci) DO UPDATE SET nilai = excluded.nilai'
  )
  const trx = db.transaction((obj) => {
    for (const [k, v] of Object.entries(obj ?? {})) up.run(String(k), String(v ?? ''))
  })
  trx(req.body)
  res.json({ ok: true })
})

// ============ GANTI PASSWORD ADMIN ============
app.put('/api/admin/password', butuhAuth, (req, res) => {
  const { lama, baru } = req.body ?? {}
  if (!baru || String(baru).length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter' })
  }
  const user = db.prepare('SELECT * FROM admin WHERE id = ?').get(req.adminId)
  if (!user || !verifyPassword(String(lama ?? ''), user.password_hash)) {
    return res.status(401).json({ error: 'Password lama salah' })
  }
  db.prepare('UPDATE admin SET password_hash = ? WHERE id = ?').run(hashPassword(String(baru)), req.adminId)
  db.prepare('DELETE FROM sesi WHERE admin_id = ? AND token != ?').run(req.adminId, req.token)
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`[server] API CMS berjalan di http://localhost:${PORT}`)
})
