# PRD — Website Kejaksaan Negeri Purbalingga

**Versi dokumen:** 1.3
**Tanggal:** 1 Oktober 2026
**Status:** v1.3.0 selesai — Landing Page + CMS + Dev Manager v2.0 + Admin UI/UX Relayout + Knex ORM & Migrasi MySQL Terukur

---

## 1. Latar Belakang & Tujuan

Kejaksaan Negeri Purbalingga membutuhkan kehadiran digital resmi yang menjadi pintu utama
informasi dan layanan hukum bagi masyarakat Kabupaten Purbalingga. Website ini bertujuan:

1. Menyajikan profil dan informasi resmi Kejaksaan Negeri Purbalingga secara terbuka.
2. Memudahkan masyarakat mengakses layanan (LANTINGBARLING, Halo JPN, SIBETA, pengaduan, edukasi hukum, informasi publik).
3. Mempublikasikan berita & kegiatan sebagai bentuk transparansi dan akuntabilitas.
4. Menegaskan nilai institusi (Tri Krama Adhyaksa) dan membangun kepercayaan publik.
5. **(v1.1)** Memberi staf/admin kemampuan memperbarui konten website tanpa coding, melalui panel admin.

## 2. Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Masyarakat umum Purbalingga | Info layanan, cara mengurus izin besuk, pengaduan |
| Pencari keadilan / pihak berperkara | Konsultasi JPN, pengambilan barang bukti |
| Pelajar & akademisi | Edukasi hukum, materi sosialisasi |
| Jurnalis / publik | Berita, kegiatan, dan informasi resmi |
| **Admin/staf humas (v1.1)** | Kelola berita, layanan, testimoni, dan teks website via panel admin |

## 3. Ruang Lingkup (v1.1)

### 3.1 Halaman utama `/` (publik)

10 section seperti v1.0, dengan konten dinamis dari API:

| # | Section | Sumber data (v1.1) |
|---|---------|--------------------|
| 1 | Navbar | Statis |
| 2 | Hero | `pengaturan.hero_deskripsi`, `pengaturan.hero_kutipan` |
| 3 | Layanan Cepat | Statis (6 pintu layanan) |
| 4 | Tentang Kami | `pengaturan.tentang_deskripsi` |
| 5 | Layanan Kami | Tabel `layanan` (CRUD) |
| 6 | Berita & Kegiatan | Tabel `berita` (CRUD, 3 terbaru) |
| 7 | Tri Krama Adhyaksa | Statis |
| 8 | Testimoni | Tabel `testimoni` (CRUD, tampil 1 pertama) |
| 9 | CTA | `pengaturan.cta_judul`, `pengaturan.cta_deskripsi` |
| 10 | Footer | `pengaturan.alamat` + tautan "Admin" |

Jika backend tidak berjalan, halaman memakai data fallback statis sehingga tetap tampil.

### 3.2 Panel admin `/admin`

- Login username + password (token sesi, tersimpan di localStorage)
- Tab **Berita**: CRUD judul, tanggal, gambar, ringkasan
- Tab **Layanan**: CRUD judul, gambar, deskripsi
- Tab **Testimoni**: CRUD nama, peran, kutipan
- Tab **Pengaturan**: edit 6 teks website (hero, tentang, CTA, alamat)
- Tab **Akun**: ganti password (min. 6 karakter, verifikasi password lama)

### 3.3 Di Luar Ruang Lingkup v1.1

- Upload gambar via admin (saat ini pilih dari file yang sudah ada di `public/`)
- Halaman detail artikel/berita dan arsip berita
- Multi-admin / peran (baru 1 akun admin)
- Multi-bahasa, mode gelap

## 4. Kebutuhan Fungsional

| ID | Kebutuhan | Status |
|----|-----------|--------|
| F-01 | Navigasi antar section via menu | ✅ Anchor menu (placeholder `#`) |
| F-02 | Menampilkan 6 layanan cepat dengan ikon | ✅ |
| F-03 | Menampilkan profil + pemutar video | ✅ (tombol play, video belum disambungkan) |
| F-04 | Menampilkan daftar layanan unggulan | ✅ dinamis dari API |
| F-05 | Menampilkan berita & kegiatan terbaru | ✅ dinamis dari API |
| F-06 | Menampilkan nilai Tri Krama Adhyaksa | ✅ |
| F-07 | Menampilkan testimoni masyarakat | ✅ dinamis dari API |
| F-08 | CTA kontak | ✅ (tombol placeholder) |
| F-09 | Informasi alamat & kontak di footer | ✅ dinamis dari pengaturan |
| F-10 | **(v1.1)** Login admin ber-token | ✅ |
| F-11 | **(v1.1)** CRUD berita/layanan/testimoni | ✅ |
| F-12 | **(v1.1)** Edit teks website via pengaturan | ✅ |
| F-13 | **(v1.1)** Ganti password admin | ✅ |
| F-14 | **(v1.1)** Perubahan admin langsung tampil di halaman utama | ✅ (fetch `/api/konten` saat load) |

## 5. Kebutuhan Non-Fungsional

| ID | Kebutuhan | Status |
|----|-----------|--------|
| NF-01 | Responsif: desktop, tablet, ponsel | ✅ (grid Tailwind responsif; panel admin mobile-friendly) |
| NF-02 | Waktu muat cepat: aset gambar lokal & terkompresi | ✅ (8 JPG lokal, ~1,4 MB total) |
| NF-03 | Aksesibilitas dasar: alt text, label tombol ikon | ✅ |
| NF-04 | Konsistensi visual: palet hijau tua + emas + krem | ✅ (design token di `index.css`) |
| NF-05 | Build production dapat direproduksi (`npm run build`) | ✅ terverifikasi |
| NF-06 | **(v1.1)** Endpoint admin wajib autentikasi | ✅ (401 tanpa token — terverifikasi) |
| NF-07 | **(v1.1)** Password tidak disimpan plain-text | ✅ (scrypt hash) |
| NF-08 | **(v1.1)** Halaman utama tetap tampil jika backend mati | ✅ (fallback `KONTEN_DEFAULT`) |

## 6. Desain & Identitas Visual

- **Warna primer:** hijau tua `#0d2818` (header, hero, section berita, CTA, footer)
- **Warna aksen:** emas `#c9a227` / `#e3b94e` (tombol, badge tanggal, ikon, garis pemisah)
- **Latar terang:** krem `#faf7ef`
- **Panel admin:** latar abu terang, header hijau tua, tombol emas — konsisten dengan identitas
- **Tipografi:** sans-serif sistem (Segoe UI / system-ui)
- **Gaya:** kartu rounded-2xl dengan shadow, badge tanggal emas pada kartu berita

## 7. Teknologi

- Frontend: React 19 + React Router 7 + Vite 6 + Tailwind CSS v4 (`@tailwindcss/vite`)
- Backend: Express 4 + CORS + Knex 3.x (ORM / Query Builder) + better-sqlite3 + mysql2 (ES modules, `server/`)
- Database: 
  - **Development / Lokal:** SQLite file `server/data/kejari.db` (WAL mode, zero-configuration)
  - **Staging / Production:** MySQL / MariaDB (InnoDB, `utf8mb4_unicode_ci`, connection pool)
- Abstraksi DB & Migrasi: Knex.js Schema Builder & Migration Engine terstruktur (`server/migrations/`)
- Auth: token acak 256-bit di tabel `sesi`, password di-hash scrypt (salted)
- Ikon: Inline SVG native; Aset: gambar lokal di `public/`

---

## 8. Arsitektur Basis Data, Migrasi Terstruktur & Mitigasi MySQL

Untuk memastikan skalabilitas masa depan saat sistem dipublikasikan ke infrastruktur cloud/instansi pemerintah (diskominfo/kejaksaan pusat), arsitektur basis data dirancang **terukur, terstruktur, berbasis ORM/Query Builder**, dan memiliki **mitigasi penuh peralihan ke MySQL/MariaDB**.

```
┌──────────────────────────────────────────────────────────┐
│                   Aplikasi Express API                   │
└─────────────────────────────┬────────────────────────────┘
                              │
             ┌────────────────▼────────────────┐
             │       Knex ORM / Query Layer     │
             │   (Dialect-Agnostic Abstraction) │
             └────────────────┬────────────────┘
                              │
               ┌──────────────┴──────────────┐
               │  Environment (DB_CLIENT)    │
               ▼                             ▼
   ┌───────────────────────┐     ┌───────────────────────┐
   │ SQLite Driver         │     │ MySQL2 Driver         │
   │ (better-sqlite3)      │     │ (Connection Pool)     │
   │ Local / Dev           │     │ Production / Cloud    │
   │ File: kejari.db (WAL) │     │ Host: 3306 (InnoDB)   │
   └───────────────────────┘     └───────────────────────┘
```

### 8.1 Skema Data & Pemetaan Tipe (SQLite vs MySQL)

Setiap tabel didefinisikan secara deklaratif di `server/migrations/20261001000001_create_initial_schema.js` menggunakan Knex Schema Builder sehingga menghasilkan DDL yang presisi di kedua platform:

| Tabel | Kolom | Tipe SQLite | Tipe MySQL (Knex) | Keterangan / Constraint |
|---|---|---|---|---|
| **`berita`** | `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT AUTO_INCREMENT PRIMARY KEY` | Kunci utama |
| | `judul` | `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Judul berita/kegiatan |
| | `ringkasan` | `TEXT NOT NULL` | `TEXT NOT NULL` | Ringkasan konten |
| | `gambar` | `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Path aset `/nama.jpg` |
| | `tanggal` | `TEXT NOT NULL` | `VARCHAR(10) NOT NULL` | Format ISO `YYYY-MM-DD` (Indexed) |
| | `created_at` | `TEXT / CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu buat |
| **`layanan`** | `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT AUTO_INCREMENT PRIMARY KEY` | Kunci utama |
| | `judul` | `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Nama layanan publik |
| | `deskripsi`| `TEXT NOT NULL` | `TEXT NOT NULL` | Rincian layanan |
| | `gambar` | `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Ikon / ilustrasi |
| | `created_at` | `TEXT / CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu buat |
| **`testimoni`**| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT AUTO_INCREMENT PRIMARY KEY` | Kunci utama |
| | `nama` | `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Nama narasumber |
| | `peran` | `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Instansi / peran |
| | `kutipan` | `TEXT NOT NULL` | `TEXT NOT NULL` | Teks pernyataan |
| | `created_at` | `TEXT / CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu buat |
| **`pengaturan`**| `kunci` | `TEXT PRIMARY KEY` | `VARCHAR(100) PRIMARY KEY` | Kunci konfigurasi |
| | `nilai` | `TEXT NOT NULL` | `TEXT NOT NULL` | Nilai teks website |
| | `updated_at` | `TEXT / CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu update |
| **`admin`** | `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT AUTO_INCREMENT PRIMARY KEY` | Kunci utama |
| | `username` | `TEXT UNIQUE NOT NULL` | `VARCHAR(100) UNIQUE NOT NULL` | Kredensial unik (Indexed) |
| | `password_hash`| `TEXT NOT NULL` | `VARCHAR(255) NOT NULL` | Hash Scrypt (salt:hash) |
| | `created_at` | `TEXT / CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu registrasi |
| **`sesi`** | `token` | `TEXT PRIMARY KEY` | `VARCHAR(128) PRIMARY KEY` | Token Bearer auth |
| | `admin_id` | `INTEGER NOT NULL` | `INT UNSIGNED NOT NULL` | FK `admin(id)` ON DELETE CASCADE |
| | `dibuat` | `TEXT / CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Waktu login |

---

### 8.2 Mekanisme Migrasi Terukur (Measurable & Structured Migrations)

Sistem migrasi diatur melalui Knex Engine dengan karakteristik:
1. **Audit & Version Tracking (`knex_migrations`)**:
   Setiap eksekusi dicatat dalam tabel `knex_migrations` dengan kolom:
   - `id`: ID urutan eksekusi
   - `name`: Nama file migrasi berstempel waktu (misal: `20261001000001_create_initial_schema.js`)
   - `batch`: Nomor batch migrasi
   - `migration_time`: Stempel waktu presisi milidetik saat dieksekusi
2. **Idempoten & Non-Destruktif**:
   Pengecekan keberadaan tabel (`hasTable`) memastikan migrasi aman dijalankan berulang tanpa merusak data eksisting.
3. **Rollback Terkontrol**:
   Setiap file migrasi menyediakan fungsi `down(knex)` untuk membatalkan perubahan skema secara teratur per batch (`npm run migrate:rollback`).
4. **Auto-Runner on Server Start**:
   Backend secara otomatis menjalankan `runMigrations()` saat inisialisasi, menjamin skema selalu sinkron di environment manapun tanpa intervensi manual.

---

### 8.3 Mitigasi & Langkah Teknis Pindah ke MySQL

Berikut adalah tabel matriks perbedaan teknis SQLite vs MySQL serta mitigasi yang telah diimplementasikan dalam arsitektur:

| Area | Karakteristik SQLite | Karakteristik MySQL | Mitigasi yang Diterapkan |
|---|---|---|---|
| **Driver & Koneksi** | File lokal tunggal (`kejari.db`) | Client-Server over TCP (`3306`) | Abstraksi via `knexfile.js`. Cukup ubah `DB_CLIENT=mysql` dan isi kredensial di `.env`. |
| **Connection Pooling** | Tidak ada (single connection) | Butuh Connection Pool untuk konkurensi | Konfigurasi pool otomatis via Knex (`min: 2, max: 10`, dapat diatur via `DB_POOL_MIN` & `DB_POOL_MAX`). |
| **Integritas Karakter** | UTF-8 default, tidak sensitif collation | Sensitif terhadap charset & collation | Skrip migrasi dan pool menetapkan `charset: 'utf8mb4'` dan `COLLATE utf8mb4_unicode_ci` (mendukung emoji & karakter aksara khusus). |
| **Foreign Keys** | Harus diaktifkan via `PRAGMA foreign_keys = ON` | Ditegakkan bawaan oleh engine InnoDB | DDL migrasi menggunakan sintaks `.references('id').inTable('admin').onDelete('CASCADE')` yang kompatibel dengan kedua mesin. |
| **Concurrency & Lock** | Kunci tingkat file (WAL mode) | Kunci tingkat baris (Row-Level Locking) | Penggantian query raw dengan Knex Query Builder yang thread-safe dan transaksional. |
| **Penanganan Waktu** | String ISO atau Unix timestamp | `DATETIME` / `TIMESTAMP` native | Menggunakan `knex.fn.now()` untuk stempel waktu konsisten di kedua platform. |
| **Migrasi Data Nyata** | Data tersimpan di disk lokal | Database di server remote/cloud | Disediakan skrip terukur `server/scripts/migrate-to-mysql.js` yang memindahkan data secara transaksional dengan laporan durasi per milidetik. |

---

### 8.4 Prosedur Operasional Standar (SOP) Migrasi ke MySQL

Saat instansi siap beralih dari SQLite ke MySQL pada server staging atau production, ikuti langkah standar berikut:

#### Langkah 1: Persiapan Environment
Salin template konfigurasi dan atur kredensial MySQL pada file `server/.env`:
```env
DB_CLIENT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=kejari_user
DB_PASSWORD=PasswordKuat123!
DB_NAME=kejari_db
DB_POOL_MIN=2
DB_POOL_MAX=20
```

#### Langkah 2: Eksekusi Migrasi Data Terukur
Jalankan perintah migrasi terukur dari root project:
```bash
npm run migrate:mysql
```

Skrip ini akan secara otomatis:
1. Memverifikasi integritas file SQLite lokal.
2. Membuka koneksi ke MySQL dan membuat database `kejari_db` bila belum ada (`utf8mb4`).
3. Menjalankan skema migrasi DDL (`knex_migrations`).
4. Memindahkan data tabel secara transaksional (`SET FOREIGN_KEY_CHECKS = 0`, insert chunk 100 baris, commit).
5. Memverifikasi pencocokan jumlah baris sumber vs target.
6. Menampilkan tabel ringkasan metrik waktu per tabel dan total durasi eksekusi dalam detik.

#### Langkah 3: Verifikasi Status
Periksa status migrasi skema dengan perintah:
```bash
npm run migrate:status
```

---

## 9. Kriteria Penerimaan

- [x] Seluruh 10 section tampil sesuai urutan mockup, konten dinamis dari API
- [x] `npm run build` sukses tanpa error (bundle dist bersih)
- [x] Panel admin modern dengan sidebar navigation, konsistensi warna Kejari, dan toast notifikasi
- [x] Login dengan `admin/admin123` berhasil; password salah ditolak (401)
- [x] Tambah/edit/hapus berita, layanan, testimoni via panel admin berhasil dan langsung tampil di `/`
- [x] Edit pengaturan teks via panel admin langsung tampil di `/`
- [x] Endpoint `/api/admin/*` tanpa token mengembalikan 401
- [x] Halaman `/` tetap tampil (data fallback) saat backend dimatikan
- [x] **(v1.3)** Arsitektur basis data berbasis Knex ORM / Query Builder dengan dukungan dual-driver (SQLite & MySQL)
- [x] **(v1.3)** Sistem migrasi terukur dan berversi (`knex_migrations`) dengan CLI `npm run migrate:*`
- [x] **(v1.3)** Skrip migrasi data transaksional SQLite ke MySQL (`npm run migrate:mysql`) teruji dan terdokumentasi

## 10. Rencana Pengembangan (Roadmap)

1. **v1.2 - v1.3 (Selesai)** — Dev Manager desktop GUI terpadu (v2.0), Redesain UI/UX panel admin, Arsitektur basis data terstruktur & mitigasi migrasi MySQL.
2. **v1.4** — Upload file & gambar dinamis via admin (storage lokal & cloud S3/GCS); halaman arsip berita publik.
3. **v2.0** — Formulir interaktif layanan online publik (pelacakan barang bukti, permohonan besuk tahanan SIBETA online, pengaduan masyarakat).

## 11. Risiko & Catatan

- **Kredensial Default:** `admin/admin123` wajib diganti segera melalui panel Admin > Keamanan Akun setelah deployment awal.
- **Backup Basis Data:** Untuk SQLite, lakukan snapshot berkala file `server/data/kejari.db`. Untuk MySQL produksi, jadwalkan `mysqldump` harian otomatis.
- **Konektivitas Cloud MySQL:** Pastikan firewall mengizinkan port `3306` dan user database memiliki hak akses `CREATE`, `ALTER`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

