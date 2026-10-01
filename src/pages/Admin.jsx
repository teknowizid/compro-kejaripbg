import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, setToken, clearToken, getToken, GAMBAR_TERSEDIA, hariDariTanggal } from '../lib/api.js'

// ---------- komponen kecil ----------
function Field({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
      />
    </label>
  )
}

function Area({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <textarea
        {...props}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
      />
    </label>
  )
}

function GambarField({ label, value, onChange }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="flex gap-2 items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          list="daftar-gambar"
          placeholder="/nama-file.jpg"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
        />
        {value && (
          <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover border" />
        )}
      </div>
      <datalist id="daftar-gambar">
        {GAMBAR_TERSEDIA.map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>
      <p className="text-xs text-gray-400 mt-1">Pilih dari daftar atau ketik path gambar di folder public/</p>
    </label>
  )
}

function Tombol({ children, variant = 'emas', ...props }) {
  const cls =
    variant === 'emas'
      ? 'bg-[#c9a227] hover:bg-[#b8941f] text-[#0d2818]'
      : variant === 'gelap'
        ? 'bg-[#0d2818] hover:bg-[#14532d] text-white'
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  return (
    <button
      {...props}
      className={`${cls} font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-50 ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

// ---------- tab CRUD generik ----------
const KOLOM = {
  berita: [
    { key: 'judul', label: 'Judul', tipe: 'text' },
    { key: 'tanggal', label: 'Tanggal (YYYY-MM-DD)', tipe: 'tanggal' },
    { key: 'gambar', label: 'Gambar', tipe: 'gambar' },
    { key: 'ringkasan', label: 'Ringkasan', tipe: 'area' },
  ],
  layanan: [
    { key: 'judul', label: 'Judul Layanan', tipe: 'text' },
    { key: 'gambar', label: 'Gambar', tipe: 'gambar' },
    { key: 'deskripsi', label: 'Deskripsi', tipe: 'area' },
  ],
  testimoni: [
    { key: 'nama', label: 'Nama', tipe: 'text' },
    { key: 'peran', label: 'Peran', tipe: 'text' },
    { key: 'kutipan', label: 'Kutipan', tipe: 'area' },
  ],
}

function CrudTab({ nama, label }) {
  const kolom = KOLOM[nama]
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const muat = async () => {
    setLoading(true)
    setError('')
    try {
      setRows(await api.list(nama))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { muat() }, [nama])

  const bukaTambah = () => {
    setEditing(null)
    setForm(Object.fromEntries(kolom.map((k) => [k.key, k.key === 'tanggal' ? new Date().toISOString().slice(0, 10) : ''])))
    setShowForm(true)
  }

  const bukaEdit = (row) => {
    setEditing(row)
    setForm(Object.fromEntries(kolom.map((k) => [k.key, row[k.key] ?? ''])))
    setShowForm(true)
  }

  const simpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) await api.update(nama, editing.id, form)
      else await api.create(nama, form)
      setShowForm(false)
      await muat()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const hapus = async (row) => {
    if (!window.confirm(`Hapus "${row.judul || row.nama}"?`)) return
    try {
      await api.remove(nama, row.id)
      await muat()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Kelola {label}</h2>
        <Tombol onClick={bukaTambah}>+ Tambah</Tombol>
      </div>
      {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Memuat...</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="bg-white border rounded-xl p-4 flex gap-4 items-center">
              {r.gambar && <img src={r.gambar} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{r.judul || r.nama}</p>
                <p className="text-xs text-gray-500 truncate">
                  {r.tanggal ? `Tanggal: ${r.tanggal} · ` : ''}
                  {r.ringkasan || r.deskripsi || r.kutipan || r.peran || ''}
                </p>
              </div>
              {nama === 'berita' && r.tanggal && (
                <span className="text-xs bg-[#0d2818] text-white rounded-lg px-2 py-1 shrink-0">
                  {hariDariTanggal(r.tanggal)}
                </span>
              )}
              <div className="flex gap-2 shrink-0">
                <Tombol variant="abu" onClick={() => bukaEdit(r)}>Edit</Tombol>
                <button
                  onClick={() => hapus(r)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-sm px-4 py-2 rounded-lg transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="text-gray-400 text-sm">Belum ada data.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={simpan} className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold mb-4">{editing ? 'Edit' : 'Tambah'} {label}</h3>
            {kolom.map((k) =>
              k.tipe === 'area' ? (
                <Area key={k.key} label={k.label} value={form[k.key] || ''} onChange={(e) => setForm({ ...form, [k.key]: e.target.value })} />
              ) : k.tipe === 'gambar' ? (
                <GambarField key={k.key} label={k.label} value={form[k.key] || ''} onChange={(v) => setForm({ ...form, [k.key]: v })} />
              ) : (
                <Field
                  key={k.key}
                  label={k.label}
                  type={k.tipe === 'tanggal' ? 'date' : 'text'}
                  required={k.key === 'judul' || k.key === 'nama'}
                  value={form[k.key] || ''}
                  onChange={(e) => setForm({ ...form, [k.key]: e.target.value })}
                />
              )
            )}
            <div className="flex gap-2 justify-end mt-2">
              <Tombol type="button" variant="abu" onClick={() => setShowForm(false)}>Batal</Tombol>
              <Tombol type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Tombol>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// ---------- tab pengaturan ----------
const PENGATURAN_FIELD = [
  { key: 'hero_deskripsi', label: 'Deskripsi Hero' },
  { key: 'hero_kutipan', label: 'Kutipan pada foto Hero' },
  { key: 'tentang_deskripsi', label: 'Deskripsi Tentang Kami' },
  { key: 'cta_judul', label: 'Judul CTA (bagian ajakan)' },
  { key: 'cta_deskripsi', label: 'Deskripsi CTA' },
  { key: 'alamat', label: 'Alamat (footer)' },
]

function PengaturanTab() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [pesan, setPesan] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getPengaturan().then((p) => { setForm(p); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const simpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    setPesan('')
    try {
      await api.savePengaturan(form)
      setPesan('Pengaturan tersimpan — halaman utama ikut terupdate.')
    } catch (err) {
      setPesan('Gagal: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-gray-500 text-sm">Memuat...</p>
  return (
    <form onSubmit={simpan}>
      <h2 className="text-lg font-bold mb-4">Pengaturan Teks Website</h2>
      {pesan && <p className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-2 mb-4">{pesan}</p>}
      {PENGATURAN_FIELD.map((f) => (
        <Area key={f.key} label={f.label} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
      ))}
      <Tombol type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</Tombol>
    </form>
  )
}

// ---------- tab akun ----------
function AkunTab({ username }) {
  const [lama, setLama] = useState('')
  const [baru, setBaru] = useState('')
  const [baru2, setBaru2] = useState('')
  const [pesan, setPesan] = useState('')

  const simpan = async (e) => {
    e.preventDefault()
    setPesan('')
    if (baru !== baru2) { setPesan('Konfirmasi password baru tidak sama.'); return }
    try {
      await api.gantiPassword(lama, baru)
      setPesan('Password berhasil diganti.')
      setLama(''); setBaru(''); setBaru2('')
    } catch (err) {
      setPesan('Gagal: ' + err.message)
    }
  }

  return (
    <form onSubmit={simpan} className="max-w-md">
      <h2 className="text-lg font-bold mb-4">Akun Admin</h2>
      <p className="text-sm text-gray-500 mb-4">Login sebagai: <b>{username}</b></p>
      {pesan && <p className="bg-amber-50 text-amber-800 text-sm rounded-lg px-4 py-2 mb-4">{pesan}</p>}
      <Field label="Password lama" type="password" value={lama} onChange={(e) => setLama(e.target.value)} required />
      <Field label="Password baru (min. 6 karakter)" type="password" value={baru} onChange={(e) => setBaru(e.target.value)} required />
      <Field label="Ulangi password baru" type="password" value={baru2} onChange={(e) => setBaru2(e.target.value)} required />
      <Tombol type="submit">Ganti Password</Tombol>
    </form>
  )
}

// ---------- halaman utama admin ----------
const TABS = [
  { id: 'berita', label: 'Berita' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'pengaturan', label: 'Pengaturan' },
  { id: 'akun', label: 'Akun' },
]

export default function Admin() {
  const [siap, setSiap] = useState(false)
  const [username, setUsername] = useState(null)
  const [tab, setTab] = useState('berita')
  const [formLogin, setFormLogin] = useState({ username: '', password: '' })
  const [errorLogin, setErrorLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  useEffect(() => {
    if (!getToken()) { setSiap(true); return }
    api.me()
      .then((m) => setUsername(m.username))
      .catch(() => clearToken())
      .finally(() => setSiap(true))
  }, [])

  const masuk = async (e) => {
    e.preventDefault()
    setLoadingLogin(true)
    setErrorLogin('')
    try {
      const r = await api.login(formLogin.username.trim(), formLogin.password)
      setToken(r.token)
      setUsername(r.username)
    } catch (err) {
      setErrorLogin(err.message)
    } finally {
      setLoadingLogin(false)
    }
  }

  const keluar = async () => {
    try { await api.logout() } catch { clearToken() }
    setUsername(null)
  }

  if (!siap) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Memuat...</div>

  if (!username) {
    return (
      <div className="min-h-screen bg-[#0d2818] flex items-center justify-center p-6">
        <form onSubmit={masuk} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold text-[#0d2818] mb-3"
                 style={{ background: 'linear-gradient(135deg, #c9a227, #e3b94e)' }}>KN</div>
            <h1 className="font-bold text-lg">Panel Admin</h1>
            <p className="text-sm text-gray-500">Kejaksaan Negeri Purbalingga</p>
          </div>
          {errorLogin && <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">{errorLogin}</p>}
          <Field label="Username" value={formLogin.username} onChange={(e) => setFormLogin({ ...formLogin, username: e.target.value })} required autoFocus />
          <Field label="Password" type="password" value={formLogin.password} onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })} required />
          <Tombol type="submit" variant="gelap" className="w-full py-2.5" disabled={loadingLogin}>
            {loadingLogin ? 'Masuk...' : 'Masuk'}
          </Tombol>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Login default: <b>admin</b> / <b>admin123</b> — segera ganti di tab Akun.
          </p>
          <p className="text-xs text-center mt-2"><Link to="/" className="text-[#8a6d1c] hover:underline">← Kembali ke website</Link></p>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#0d2818] text-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0d2818] text-xs"
                 style={{ background: 'linear-gradient(135deg, #c9a227, #e3b94e)' }}>KN</div>
            <div>
              <p className="font-bold">Panel Admin</p>
              <p className="text-xs text-white/60">Halo, {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-white/70 hover:text-white">Lihat Website</Link>
            <button onClick={keluar} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">Keluar</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <nav className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === t.id ? 'bg-[#0d2818] text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="bg-gray-50 rounded-2xl p-6 min-h-[400px]">
          {tab === 'berita' && <CrudTab nama="berita" label="Berita & Kegiatan" />}
          {tab === 'layanan' && <CrudTab nama="layanan" label="Layanan" />}
          {tab === 'testimoni' && <CrudTab nama="testimoni" label="Testimoni" />}
          {tab === 'pengaturan' && <PengaturanTab />}
          {tab === 'akun' && <AkunTab username={username} />}
        </div>
      </div>
    </div>
  )
}
