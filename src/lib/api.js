// Klien API untuk backend CMS (Express + SQLite, folder server/).
// Saat development, Vite mem-proxy /api -> http://localhost:3001 (lihat vite.config.js).
// Kalau backend tidak jalan, halaman utama otomatis memakai KONTEN_DEFAULT di bawah
// sehingga website tetap tampil (mode fallback statis).

export const KONTEN_DEFAULT = {
  berita: [
    {
      id: 'd1',
      judul: 'Upacara Peringatan Hari Lahir Kejaksaan Republik Indonesia',
      ringkasan:
        'Kejaksaan Negeri Purbalingga melaksanakan upacara peringatan hari lahir Kejaksaan RI dengan khidmat dan penuh semangat.',
      gambar: '/upacara.jpg',
      tanggal: '2026-09-12',
    },
    {
      id: 'd2',
      judul: 'Sosialisasi Hukum di Sekolah',
      ringkasan:
        'Kejaksaan Negeri Purbalingga memberikan edukasi hukum kepada pelajar sebagai upaya pencegahan pelanggaran hukum sejak dini.',
      gambar: '/sekolah.jpg',
      tanggal: '2026-09-08',
    },
    {
      id: 'd3',
      judul: 'Penguatan Zona Integritas',
      ringkasan:
        'Kejaksaan Negeri Purbalingga berkomitmen mewujudkan Wilayah Birokrasi Bersih dan Melayani (WBBM).',
      gambar: '/gedung.jpg',
      tanggal: '2026-09-01',
    },
  ],
  layanan: [
    {
      id: 'd1',
      judul: 'Pelayanan Antar Barang Bukti (LANTINGBARLING)',
      deskripsi:
        'Layanan antar barang bukti yang telah berkekuatan hukum tetap kepada pemiliknya secara gratis.',
      gambar: '/barang-bukti.jpg',
    },
    {
      id: 'd2',
      judul: 'Halo JPN (Jaksa Pengacara Negara)',
      deskripsi:
        'Layanan konsultasi hukum dan bantuan hukum oleh Jaksa Pengacara Negara untuk masyarakat.',
      gambar: '/konsultasi.jpg',
    },
    {
      id: 'd3',
      judul: 'SIBETA (Surat Izin Besuk Tahanan)',
      deskripsi: 'Layanan permohonan izin besuk tahanan secara mudah, cepat, dan transparan.',
      gambar: '/besuk.jpg',
    },
  ],
  testimoni: [
    {
      id: 'd1',
      nama: 'Andi Prabowo',
      peran: 'Masyarakat',
      kutipan:
        'Layanan yang diberikan sangat profesional dan membantu, saya memahami hak-hak saya dalam proses hukum yang rumit.',
    },
  ],
  pengaturan: {
    hero_deskripsi:
      'Kami hadir untuk menegakkan hukum, melindungi kepentingan masyarakat, dan mewujudkan keadilan di Kabupaten Purbalingga.',
    hero_kutipan: 'Kejaksaan hadir untuk masyarakat, demi hukum yang berkeadilan.',
    tentang_deskripsi:
      'Kejaksaan Negeri Purbalingga adalah lembaga penegak hukum yang berkomitmen menegakkan supremasi hukum, melindungi kepentingan umum, dan memberikan pelayanan hukum yang profesional, transparan, dan berkeadilan pada kepentingan masyarakat.',
    cta_judul: 'Dapatkan Layanan Hukum\ndan Informasi Terpercaya',
    cta_deskripsi: 'Hubungi kami sekarang untuk mendapatkan informasi dan layanan yang kamu butuhkan.',
    alamat: 'Jalan Jendral Sudirman No. 93A,\nPurbalingga, Jawa Tengah 53311',
  },
}

export async function fetchKonten() {
  try {
    const r = await fetch('/api/konten')
    if (!r.ok) throw new Error('HTTP ' + r.status)
    const j = await r.json()
    return {
      berita: Array.isArray(j.berita) && j.berita.length ? j.berita : KONTEN_DEFAULT.berita,
      layanan: Array.isArray(j.layanan) && j.layanan.length ? j.layanan : KONTEN_DEFAULT.layanan,
      testimoni: Array.isArray(j.testimoni) && j.testimoni.length ? j.testimoni : KONTEN_DEFAULT.testimoni,
      pengaturan: { ...KONTEN_DEFAULT.pengaturan, ...(j.pengaturan || {}) },
    }
  } catch {
    return KONTEN_DEFAULT
  }
}

// ---------- auth admin (token disimpan di localStorage) ----------
const TOKEN_KEY = 'kejari_admin_token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function req(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (!t) throw new Error('Belum login — silakan login dulu')
    headers.Authorization = 'Bearer ' + t
  }
  const r = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status)
  return j
}

export const api = {
  login: (username, password) => req('/api/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => req('/api/auth/logout', { method: 'POST', auth: true }).finally(clearToken),
  me: () => req('/api/auth/me', { auth: true }),
  list: (nama) => req(`/api/admin/${nama}`, { auth: true }),
  create: (nama, data) => req(`/api/admin/${nama}`, { method: 'POST', auth: true, body: data }),
  update: (nama, id, data) => req(`/api/admin/${nama}/${id}`, { method: 'PUT', auth: true, body: data }),
  remove: (nama, id) => req(`/api/admin/${nama}/${id}`, { method: 'DELETE', auth: true }),
  getPengaturan: () => req('/api/admin/pengaturan', { auth: true }),
  savePengaturan: (data) => req('/api/admin/pengaturan', { method: 'PUT', auth: true, body: data }),
  gantiPassword: (lama, baru) => req('/api/admin/password', { method: 'PUT', auth: true, body: { lama, baru } }),
}

// Daftar gambar yang tersedia di folder public/ (untuk dipilih di form admin)
export const GAMBAR_TERSEDIA = [
  '/hero.jpg',
  '/gedung.jpg',
  '/barang-bukti.jpg',
  '/konsultasi.jpg',
  '/besuk.jpg',
  '/upacara.jpg',
  '/sekolah.jpg',
  '/hukum.jpg',
]

// "2026-09-12" -> "12" (untuk badge tanggal pada kartu berita)
export function hariDariTanggal(iso) {
  const m = String(iso || '').match(/(\d{4})-(\d{2})-(\d{2})/)
  return m ? String(parseInt(m[3], 10)) : ''
}
