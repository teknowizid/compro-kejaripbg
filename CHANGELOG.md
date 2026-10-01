# Changelog

Semua perubahan penting pada project ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/).

## [1.3.0] - 2026-10-01

### Ditambahkan & Ditingkatkan
- **Dev Manager Dashboard Desktop GUI Terpadu (v2.0)**:
  - **Launcher Bersih Tanpa Terminal Menggantung**: `Dev Manager.bat` membuka dashboard desktop secara langsung menggunakan `-WindowStyle Hidden` tanpa meninggalkan jendela command prompt hitam yang mengganggu.
  - **Deteksi Port Non-Blocking**: Mengganti pemanggilan `TcpClient.BeginConnect` yang sebelumnya membekukan UI hingga 1.2 detik per detik menjadi `[System.Net.NetworkInformation.IPGlobalProperties]` yang instan (~6ms) sehingga GUI berjalan mulus tanpa macet/not responding.
  - **Pembersihan Proses Anti-Zombie**: Terminasi berbasis Process Tree (`taskkill /T /F`) dan pembebasan port otomatis (`Stop-PortProcess`) sehingga tidak ada proses `node` atau `vite` nyangkut saat service dihentikan atau dashboard ditutup.
  - **Kontrol Lengkap Per Layanan**: Kartu terpisah untuk Backend API (:3001) dan Frontend (:5173) dilengkapi indikator status visual, port, PID proses aktif, tombol **Start**, **Stop**, **Restart**, dan tautan cepat endpoint/website.
  - **Master Toolbar**: Tombol **Start Semua**, **Stop Semua**, **Restart Semua**, **Buka Web**, **Admin CMS**, dan **npm install** dalam 1 panel kontrol terpadu.
  - **Log Viewer dengan Tab Filter**: Filter log instan berdasarkan tab **Semua Log**, **Backend (API)**, **Frontend (Vite)**, dan **Error Log**, dilengkapi pembersih kode warna ANSI (bebas karakter rusak seperti `zo`), checkbox **Auto-scroll**, tombol **Salin**, **Bersihkan**, dan **Folder Log**.
- **Relayout UI/UX Panel Admin Modern & Profesional**:
  - **Arsitektur Dashboard Sidebar**: Mengganti tab horizontal jadul dengan layout dashboard sidebar standar industri (logo KN emas, navigasi berkategori, badge jumlah entri dinamis, dan widget profil admin dengan logout).
  - **Konsistensi Palet Warna Resmi**: Harmonisasi warna institusional Kejaksaan (Forest Green `#0d2818` / `#14532d`, Gold Emas `#c9a227` / `#e3b94e`, dan Slate `#f8fafc` / `#ffffff`) di seluruh komponen.
  - **Quick Stats Bar**: Kartu statistik ringkasan total berita, layanan publik, dan testimoni masyarakat di bagian atas dashboard.
  - **Pencarian Real-Time & Filter**: Input pencarian instan pada tab Berita, Layanan, dan Testimoni dengan indikator jumlah entri dan tampilan *empty state* yang interaktif.
  - **Visual Image Picker**: Pemilih gambar galeri interaktif langsung dari aset `public/` dengan thumbnail preview saat menambah/mengedit konten.
  - **Dialog Konfirmasi Hapus**: Mengganti alert browser default (`window.confirm`) dengan modal konfirmasi modern berlatar *backdrop blur*.
  - **Pengelompokan Kartu Pengaturan Website**: Form teks website ditata rapi dalam 4 kartu kontekstual (Hero Section, Profil Lembaga, CTA Banner, dan Footer).
  - **Desain Halaman Login Elegan**: Tampilan login modern dengan latar radial institusional, lambang KN emas, dan toggle lihat/sembunyikan kata sandi.
  - **Sistem Notifikasi Toast**: Feedback aksi pengguna (tambah, edit, hapus, simpan pengaturan, ganti password) ditampilkan melalui toast notifikasi animasi halus di pojok kanan bawah.
- **Arsitektur Basis Data Terukur, Knex ORM & Mitigasi Migrasi MySQL**:
  - **Dukungan Dual-Driver (SQLite & MySQL)**: Integrasi Knex.js sebagai ORM / Query Builder dan Migration Engine dengan driver `better-sqlite3` untuk lokal/dev dan `mysql2` dengan connection pooling untuk staging/produksi (cukup set `DB_CLIENT=mysql` di `.env`).
  - **Migrasi Skema Terstruktur**: Seluruh tabel skema (`berita`, `layanan`, `testimoni`, `pengaturan`, `admin`, `sesi`) didefinisikan secara deklaratif di `server/migrations/` dengan versioning waktu dan audit log di tabel `knex_migrations`.
  - **Perintah CLI Migrasi Terpadu**: Ditambahkan script `npm run migrate`, `npm run migrate:status`, dan `npm run migrate:rollback` di root project.
  - **Skrip Migrasi SQLite -> MySQL Terukur**: Disediakan `server/scripts/migrate-to-mysql.js` (`npm run migrate:mysql`) yang memindahkan data secara transaksional (`SET FOREIGN_KEY_CHECKS = 0`, chunking, commit) dengan pelaporan durasi per milidetik dan validasi hitungan data.
  - **Dokumentasi PRD Komprehensif**: Dicatat lengkap di `PRD.md` Bagian 8 mencakup skema pemetaan tipe data, mitigasi charset `utf8mb4`, timezone, foreign keys, dan SOP migrasi zero-downtime.

## [1.2.1] - 2026-10-01

### Diperbaiki
- **Dev Manager crash ("forced close") saat klik Start** — penyebab: event handler
  async .NET (`add_OutputDataReceived`) yang menulis ke antrean log dari thread pool;
  unhandled exception di thread tersebut mematikan seluruh GUI. Sekarang child process
  (node) me-redirect stdout/stderr ke file (`tools/logs/*.log`), lalu timer UI me-tail
  file tersebut — 100% berjalan di UI thread, anti-crash. Bonus: log tersimpan permanen
  di file dan bisa dilihat ulang.
- **Test-Port selalu lapor "BERJALAN"** walau port tertutup — `WaitOne()` hanya menunggu
  sinyal, bukan memastikan koneksi sukses. Sekarang memakai `EndConnect()` sehingga
  status indikator akurat.
- **Stop-Sweep tidak pernah cocok** — pola `*test-muse\server*` tidak ada di command line
  proses (`node index.js`). Sekarang memakai pola `*index.js*` / `*vite*`.
- Nama parameter `$args` (bentrok dengan variabel otomatis PowerShell) diganti `$argumen`.

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
