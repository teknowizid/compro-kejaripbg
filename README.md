# Website Kejaksaan Negeri Purbalingga

Website profil resmi **Kejaksaan Negeri Purbalingga** — dibangun dengan React, Vite, dan Tailwind CSS,
dilengkapi **backend CMS (Express + SQLite)** dan **panel admin** sehingga konten halaman utama
bisa diubah tanpa coding.

## Arsitektur

```
Browser ──/api/konten──▶ Express :3001 ──▶ SQLite (server/data/kejari.db)
   │                          ▲
   │                     /api/admin/* (butuh token login)
   │
   ├─ /         halaman utama (data dinamis dari API, fallback statis bila API mati)
   └─ /admin    panel admin (login + CRUD berita/layanan/testimoni/pengaturan)
```

## Teknologi

| Komponen   | Versi / Keterangan                        |
|------------|-------------------------------------------|
| React      | 19.x + React Router 7 (routing `/` dan `/admin`) |
| Vite       | 6.x (proxy `/api` → `http://localhost:3001` saat dev) |
| Tailwind CSS | 4.x (via plugin `@tailwindcss/vite`)    |
| Backend    | Express 4 + better-sqlite3 + CORS (folder `server/`) |
| Auth admin | Token acak (scrypt untuk hash password)   |
| Ikon       | Inline SVG (tanpa dependensi ikon eksternal) |
| Gambar     | Aset lokal di `public/` (8 file JPG)      |

## Cara Menjalankan

### Opsi A — Dev Manager (GUI, tanpa terminal) ⭐

Double-click **`Dev Manager.bat`** di folder project `D:\my-project\test-muse`.
Dashboard desktop GUI terpadu akan langsung terbuka (tanpa jendela terminal hitam menggantung):

- **Kartu Backend API (:3001)**: Status visual (● Berjalan / Berhenti), PID proses, tombol **Start**, **Stop**, **Restart**, serta tombol tes endpoint `/api/konten`.
- **Kartu Frontend Website (:5173)**: Status visual, PID proses, tombol **Start**, **Stop**, **Restart**, serta tombol buka langsung ke browser.
- **Master Toolbar**: Tombol **Start Semua**, **Stop Semua**, **Restart Semua**, **Buka Web**, **Admin CMS**, dan **npm install**.
- **Log Viewer Terpadu**: Tab filter (**Semua Log**, **Backend**, **Frontend**, **Error**), pembersihan karakter warna ANSI otomatis, toggle **Auto-scroll**, tombol **Salin ke Clipboard**, tombol **Bersihkan**, dan shortcut ke folder log.
- **Deteksi Port Non-Blocking**: Menggunakan query TCP listeners tingkat kernel (~6ms) sehingga GUI responsif dan anti-macet ("Not Responding").
- **Auto Cleanup**: Menutup jendela dashboard otomatis menghentikan proses backend & frontend secara tuntas hingga ke child process (`taskkill /T /F`) dan membebaskan port.

### Opsi B — via terminal

Butuh **dua terminal** (atau dua tab): satu untuk backend, satu untuk frontend.

```bash
# Terminal 1 — backend API (http://localhost:3001)
cd D:\my-project\test-muse
npm run server          # atau: npm run server:dev  (auto-reload)

# Terminal 2 — frontend (http://localhost:5173)
cd D:\my-project\test-muse
npm run dev
```

Perintah lain:

```bash
npm run build     # build production frontend ke folder dist/
npm run preview   # pratinjau hasil build production

# Perintah Migrasi Basis Data (Knex ORM):
npm run migrate           # Jalankan migrasi skema terbaru
npm run migrate:status    # Cek status daftar migrasi yang sudah/belum jalan
npm run migrate:rollback  # Rollback batch migrasi terakhir
npm run migrate:mysql     # Migrasi terukur dari SQLite ke MySQL (otomatis create DB & transaksional)
```


> Catatan: `npm run dev` mem-proxy `/api` ke backend, jadi backend **wajib jalan**
> agar halaman utama menampilkan data terbaru. Jika backend mati, halaman otomatis
> memakai data fallback statis sehingga tetap tampil.

## Panel Admin

Buka **http://localhost:5173/admin** (atau klik tautan "Admin" di footer).

- Login default: username `admin`, password `admin123`
- **Segera ganti password** setelah login pertama via tab **Akun**
- Tab yang tersedia:
  - **Berita** — tambah/edit/hapus berita & kegiatan (judul, tanggal, gambar, ringkasan)
  - **Layanan** — tambah/edit/hapus kartu layanan (judul, gambar, deskripsi)
  - **Testimoni** — tambah/edit/hapus testimoni masyarakat
  - **Pengaturan** — ubah teks website (deskripsi hero, kutipan, deskripsi tentang, judul & deskripsi CTA, alamat)
  - **Akun** — ganti password admin
- Setiap perubahan tersimpan di SQLite dan **langsung tampil di halaman utama** (refresh halaman `/`).

## API Backend (ringkas)

| Method & Path | Auth | Keterangan |
|---|---|---|
| `GET /api/konten` | — | Seluruh konten publik (berita, layanan, testimoni, pengaturan) |
| `GET /api/kesehatan` | — | Health check |
| `POST /api/auth/login` | — | Login → `{ token, username }` |
| `POST /api/auth/logout` | token | Hapus sesi |
| `GET /api/auth/me` | token | Info admin login |
| `GET/POST /api/admin/berita` | token | List / tambah berita |
| `PUT/DELETE /api/admin/berita/:id` | token | Edit / hapus berita |
| `GET/POST /api/admin/layanan` | token | (sama, untuk layanan) |
| `PUT/DELETE /api/admin/layanan/:id` | token | |
| `GET/POST /api/admin/testimoni` | token | (sama, untuk testimoni) |
| `PUT/DELETE /api/admin/testimoni/:id` | token | |
| `GET/PUT /api/admin/pengaturan` | token | Baca / simpan pengaturan teks |
| `PUT /api/admin/password` | token | Ganti password |

Header auth: `Authorization: Bearer <token>`.
Database default: `server/data/kejari.db` (SQLite) atau MySQL sesuai konfigurasi `DB_CLIENT`.

## Migrasi Basis Data & Panduan Pindah ke MySQL

Proyek ini telah menggunakan **Knex.js** sebagai *database abstraction layer* (ORM / Query Builder & Migration Engine) dengan dukungan arsitektur **Dual-Driver**:
- **SQLite (Default Dev / Lokal)**: Data tersimpan di `server/data/kejari.db` (zero configuration, otomatis dibuat & di-seed).
- **MySQL / MariaDB (Staging / Production)**: Mendukung *connection pooling* (`mysql2`), isolasi transaksi InnoDB, dan charset `utf8mb4`.

### Perintah CLI Migrasi

Jalankan perintah ini langsung dari folder root proyek:

| Perintah | Fungsi |
|---|---|
| `npm run migrate` | Menjalankan seluruh file migrasi skema terbaru yang belum diterapkan |
| `npm run migrate:status` | Memeriksa status audit file migrasi (`Completed` / `Pending`) |
| `npm run migrate:rollback` | Membatalkan (*rollback*) batch migrasi skema terakhir |
| `npm run migrate:mysql` | Eksekusi migrasi data terukur dari SQLite ke MySQL secara transaksional |

### Panduan Langkah Demi Langkah Beralih ke MySQL

Saat aplikasi siap dideploy menggunakan database MySQL:

1. **Konfigurasi Environment**:
   Salin `server/.env.example` menjadi `server/.env`:
   ```env
   DB_CLIENT=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=password_anda
   DB_NAME=kejari_db
   ```
2. **Jalankan Migrasi Data Terukur**:
   ```bash
   npm run migrate:mysql
   ```
   Skrip ini secara otomatis:
   - Membuat database target MySQL (`utf8mb4_unicode_ci`) jika belum ada.
   - Menjalankan seluruh skema migrasi tabel Knex.
   - Memindahkan seluruh data tabel secara transaksional (`SET FOREIGN_KEY_CHECKS = 0`, chunking, commit).
   - Menampilkan tabel rekapitulasi durasi eksekusi milidetik dan memvalidasi kecocokan jumlah baris.
3. **Mulai Server**:
   Jalankan `npm run server` atau buka lewat **Dev Manager.bat**. Backend akan otomatis berjalan di atas database MySQL.

> Detail lengkap arsitektur basis data, pemetaan tipe data, dan mitigasi teknis dapat dibaca di **[PRD.md](PRD.md) Bagian 8**.

## Struktur Project

```
test-muse/
├── Dev Manager.bat         # Launcher dashboard GUI desktop (tanpa terminal)
├── index.html
├── vite.config.js          # proxy /api -> localhost:3001 (dev)
├── package.json            # scripts: dev, build, server, migrate, migrate:mysql
├── public/                 # 8 aset foto resmi
├── server/
│   ├── .env.example        # template konfigurasi DB (SQLite / MySQL)
│   ├── package.json        # express, knex, better-sqlite3, mysql2, cors
│   ├── knexfile.js         # konfigurasi koneksi Knex dual-driver
│   ├── index.js            # aplikasi Express + endpoint API + auto-migration
│   ├── db.js               # inisialisasi Knex ORM, SQLite instance, password hashing
│   ├── migrations/         # skema tabel terstruktur & seed baseline berversi
│   ├── scripts/            # migrate-to-mysql.js (skrip migrasi data terukur)
│   └── data/kejari.db      # database SQLite lokal
├── src/
│   ├── main.jsx
│   ├── index.css           # Tailwind v4 + design tokens (warna, font)
│   ├── App.jsx             # routing: / -> Home, /admin -> Admin
│   ├── lib/api.js          # klien API terpusat + KONTEN_DEFAULT (fallback)
│   └── pages/
│       ├── Home.jsx        # landing page dinamis
│       └── Admin.jsx       # panel admin modern (sidebar, visual picker, modal)
├── tools/
│   └── dev-manager.ps1     # core GUI desktop dashboard (Windows Forms non-blocking)
├── README.md
├── CHANGELOG.md
└── PRD.md
```

## Kustomisasi

- **Warna utama**: design token di `src/index.css` (`--color-hijau-tua`, `--color-emas`, dst.)
- **Teks website**: ubah lewat panel admin (tab Pengaturan) — tanpa perlu edit kode
- **Gambar**: ganti file di `public/` dengan nama yang sama, atau pilih dari daftar di form admin

## Catatan Production

- Saat deploy, pastikan request `/api/*` diteruskan ke backend (reverse proxy),
  atau jalankan backend di host/port yang sama dengan frontend.
- `server/data/kejari.db` adalah file — backup berkala jika data penting.
- Ganti kredensial default dan pertimbangkan HTTPS + rate limiting untuk akses publik.
