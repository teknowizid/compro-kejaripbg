# Changelog

Semua perubahan penting pada project ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/).

## [1.2.0] - 2026-10-01

### Ditambahkan
- **Dev Manager** — GUI desktop (Windows Forms, `Dev Manager.bat` + `tools/dev-manager.ps1`):
  tanpa terminal, tanpa install tambahan. Fitur: tombol Start/Stop per layanan
  (Backend :3001, Frontend :5173), indikator status otomatis tiap 2 detik,
  Start Semua / Stop Semua, tombol Buka Website & Buka Admin, dan panel log gabungan.
  Menutup jendela otomatis menghentikan proses yang dijalankannya.

## [1.1.0] - 2026-10-01

CMS — backend API + panel admin. Perubahan di admin otomatis tampil di halaman utama.

### Ditambahkan
- Backend `server/` (Express 4 + better-sqlite3 + CORS, ES modules):
  - `GET /api/konten` — seluruh konten publik (berita, layanan, testimoni, pengaturan)
  - Auth admin: `POST /api/auth/login|logout`, `GET /api/auth/me` (token acak via header `Authorization: Bearer`)
  - CRUD ber-token: `/api/admin/berita`, `/api/admin/layanan`, `/api/admin/testimoni` (GET/POST/PUT/DELETE)
  - `GET/PUT /api/admin/pengaturan` — teks website (hero, tentang, CTA, alamat)
  - `PUT /api/admin/password` — ganti password (hash scrypt, sesi lain dicabut)
  - SQLite di `server/data/kejari.db` (WAL mode) + seed otomatis: 3 berita, 3 layanan, 1 testimoni, 6 pengaturan, akun `admin/admin123`
- Panel admin di route `/admin` (React Router):
  - Halaman login (validasi, pesan error, tautan kembali ke website)
  - Tab Berita / Layanan / Testimoni: list + tambah/edit/hapus via modal form (termasuk pemilih gambar dari `public/`)
  - Tab Pengaturan: form 6 teks website
  - Tab Akun: ganti password dengan konfirmasi
- Halaman utama (`/`) kini mengambil konten dari `/api/konten` dengan fallback statis (`KONTEN_DEFAULT`)
  sehingga tetap tampil saat backend mati
- React Router 7: `/` → Home, `/admin` → Admin; tautan "Admin" di footer
- Proxy Vite `/api` → `http://localhost:3001` saat `npm run dev`
- Script npm baru: `npm run server` dan `npm run server:dev` (auto-reload via `node --watch`)
- Klien API terpusat di `src/lib/api.js` (fetch, auth localStorage, helper tanggal & daftar gambar)

### Diverifikasi
- Suite tes endpoint (PowerShell): login OK, create/update/delete berita OK, 401 tanpa token OK,
  401 password salah OK, pengaturan OK, logout OK
- `npm run build` sukses — bundle `dist/` + seluruh aset gambar

## [1.0.0] - 2026-10-01

Rilis awal — implementasi penuh landing page Kejaksaan Negeri Purbalingga sesuai mockup.

### Ditambahkan
- Project React 19 + Vite 6 + Tailwind CSS v4 (scaffold manual, plugin `@tailwindcss/vite`)
- Design token warna di `src/index.css`: hijau tua, hijau, emas, emas terang, krem
- **Navbar**: logo, 6 menu navigasi (Beranda, Tentang, Layanan, Informasi Publik, Berita, Kontak), tombol "Hubungi Kami", ikon pencarian
- **Hero**: judul sambutan, tagline, tombol "Layanan Kami" & "Tentang Kami", badge Profesional/Berintegritas/Melayani, foto + kartu kutipan
- **Layanan cepat**: strip 6 layanan (LANTINGBARLING, Halo JPN, SIBETA, Pengaduan Masyarakat, Edukasi Hukum, Informasi Publik) dengan ikon SVG
- **Tentang Kami**: foto gedung + tombol putar video, profil singkat, badge Profesional/Transparan/Akuntabel, tautan "Selengkapnya"
- **Layanan Kami**: 3 kartu layanan unggulan (barang bukti, konsultasi JPN, izin besuk tahanan)
- **Berita & Kegiatan**: section gelap berisi 3 kartu berita (upacara, sosialisasi sekolah, zona integritas) dengan badge tanggal
- **Tri Krama Adhyaksa**: nilai Satya, Adhi, Wicaksana
- **Testimoni**: kutipan masyarakat di atas latar foto
- **CTA**: ajakan "Dapatkan Layanan Hukum dan Informasi Terpercaya" + tombol "Hubungi Kami"
- **Footer**: alamat kantor, navigasi, layanan populer, ikon media sosial, copyright
- 8 aset foto lokal di `public/` (hero, gedung, barang-bukti, konsultasi, besuk, upacara, sekolah, hukum)
- Dokumentasi: `README.md`, `PRD.md`, dan file changelog ini

### Diverifikasi
- `npm run build` sukses — output `dist/` berisi `index.html`, bundle JS/CSS, dan seluruh aset gambar

[1.2.0]: https://example.com/releases/v1.2.0
[1.1.0]: https://example.com/releases/v1.1.0
[1.0.0]: https://example.com/releases/v1.0.0
