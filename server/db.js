// Inisialisasi database SQLite + seed data awal.
// Dijalankan otomatis saat server start. Aman di-run berulang (idempotent).
import Database from 'better-sqlite3'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import knexLib from 'knex'
import knexConfig from './knexfile.js'

const dir = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(dir, 'data')
fs.mkdirSync(dataDir, { recursive: true })

export const db = new Database(path.join(dataDir, 'kejari.db'))
db.pragma('journal_mode = WAL')

export const knex = knexLib(knexConfig[process.env.NODE_ENV || 'development'])

export async function runMigrations() {
  try {
    const [batch, files] = await knex.migrate.latest()
    if (files && files.length > 0) {
      console.log(`[db] Migrasi skema Knex diterapkan (Batch ${batch}): ${files.join(', ')}`)
    }
  } catch (err) {
    console.error('[db] Peringatan migrasi Knex:', err.message)
  }
}

db.exec(`
CREATE TABLE IF NOT EXISTS berita (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL DEFAULT '',
  gambar TEXT NOT NULL DEFAULT '/upacara.jpg',
  tanggal TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS layanan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL DEFAULT '',
  gambar TEXT NOT NULL DEFAULT '/barang-bukti.jpg'
);
CREATE TABLE IF NOT EXISTS testimoni (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  peran TEXT NOT NULL DEFAULT '',
  kutipan TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS pengaturan (
  kunci TEXT PRIMARY KEY,
  nilai TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sesi (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
  dibuat TEXT NOT NULL DEFAULT (datetime('now'))
);
`)

// ---- password hashing (scrypt, tanpa dependensi tambahan) ----
export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  try {
    const [salt, hash] = String(stored).split(':')
    if (!salt || !hash) return false
    const a = scryptSync(password, salt, 64)
    const b = Buffer.from(hash, 'hex')
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

// ---- seed data awal (hanya jika tabel masih kosong) ----
const PENGATURAN_AWAL = {
  hero_deskripsi: 'Kami hadir untuk menegakkan hukum, melindungi kepentingan masyarakat, dan mewujudkan keadilan di Kabupaten Purbalingga.',
  hero_kutipan: 'Kejaksaan hadir untuk masyarakat, demi hukum yang berkeadilan.',
  tentang_deskripsi: 'Kejaksaan Negeri Purbalingga adalah lembaga penegak hukum yang berkomitmen menegakkan supremasi hukum, melindungi kepentingan umum, dan memberikan pelayanan hukum yang profesional, transparan, dan berkeadilan pada kepentingan masyarakat.',
  cta_judul: 'Dapatkan Layanan Hukum\ndan Informasi Terpercaya',
  cta_deskripsi: 'Hubungi kami sekarang untuk mendapatkan informasi dan layanan yang kamu butuhkan.',
  alamat: 'Jalan Jendral Sudirman No. 93A,\nPurbalingga, Jawa Tengah 53311',
}

const BERITA_AWAL = [
  {
    judul: 'Upacara Peringatan Hari Lahir Kejaksaan Republik Indonesia',
    ringkasan: 'Kejaksaan Negeri Purbalingga melaksanakan upacara peringatan hari lahir Kejaksaan RI dengan khidmat dan penuh semangat.',
    gambar: '/upacara.jpg',
    tanggal: '2026-09-12',
  },
  {
    judul: 'Sosialisasi Hukum di Sekolah',
    ringkasan: 'Kejaksaan Negeri Purbalingga memberikan edukasi hukum kepada pelajar sebagai upaya pencegahan pelanggaran hukum sejak dini.',
    gambar: '/sekolah.jpg',
    tanggal: '2026-09-08',
  },
  {
    judul: 'Penguatan Zona Integritas',
    ringkasan: 'Kejaksaan Negeri Purbalingga berkomitmen mewujudkan Wilayah Birokrasi Bersih dan Melayani (WBBM).',
    gambar: '/gedung.jpg',
    tanggal: '2026-09-01',
  },
]

const LAYANAN_AWAL = [
  {
    judul: 'Pelayanan Antar Barang Bukti (LANTINGBARLING)',
    deskripsi: 'Layanan antar barang bukti yang telah berkekuatan hukum tetap kepada pemiliknya secara gratis.',
    gambar: '/barang-bukti.jpg',
  },
  {
    judul: 'Halo JPN (Jaksa Pengacara Negara)',
    deskripsi: 'Layanan konsultasi hukum dan bantuan hukum oleh Jaksa Pengacara Negara untuk masyarakat.',
    gambar: '/konsultasi.jpg',
  },
  {
    judul: 'SIBETA (Surat Izin Besuk Tahanan)',
    deskripsi: 'Layanan permohonan izin besuk tahanan secara mudah, cepat, dan transparan.',
    gambar: '/besuk.jpg',
  },
]

const TESTIMONI_AWAL = [
  {
    nama: 'Andi Prabowo',
    peran: 'Masyarakat',
    kutipan: 'Layanan yang diberikan sangat profesional dan membantu, saya memahami hak-hak saya dalam proses hukum yang rumit.',
  },
]

export function seedIfEmpty() {
  const kosong = (tabel) => db.prepare(`SELECT COUNT(*) AS c FROM ${tabel}`).get().c === 0

  if (kosong('pengaturan')) {
    const ins = db.prepare('INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?)')
    for (const [k, v] of Object.entries(PENGATURAN_AWAL)) ins.run(k, v)
    console.log('[db] seed pengaturan: OK')
  }
  if (kosong('berita')) {
    const ins = db.prepare('INSERT INTO berita (judul, ringkasan, gambar, tanggal) VALUES (?, ?, ?, ?)')
    for (const b of BERITA_AWAL) ins.run(b.judul, b.ringkasan, b.gambar, b.tanggal)
    console.log('[db] seed berita: OK')
  }
  if (kosong('layanan')) {
    const ins = db.prepare('INSERT INTO layanan (judul, deskripsi, gambar) VALUES (?, ?, ?)')
    for (const l of LAYANAN_AWAL) ins.run(l.judul, l.deskripsi, l.gambar)
    console.log('[db] seed layanan: OK')
  }
  if (kosong('testimoni')) {
    const ins = db.prepare('INSERT INTO testimoni (nama, peran, kutipan) VALUES (?, ?, ?)')
    for (const t of TESTIMONI_AWAL) ins.run(t.nama, t.peran, t.kutipan)
    console.log('[db] seed testimoni: OK')
  }
  if (kosong('admin')) {
    // Kredensial default — WAJIB diganti setelah login pertama via halaman Admin > Akun
    db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)').run('admin', hashPassword('admin123'))
    console.log('[db] akun admin default dibuat (admin / admin123) — segera ganti password!')
  }
}
