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
Database: `server/data/kejari.db` (dibuat otomatis + seed saat server pertama dijalankan).

## Struktur Project

```
test-muse/
├── index.html
├── vite.config.js          # proxy /api -> localhost:3001 (dev)
├── package.json            # scripts: dev, build, preview, server, server:dev
├── public/                 # 8 aset foto (hero, gedung, layanan, berita, ...)
├── server/
│   ├── package.json        # express, better-sqlite3, cors
│   ├── index.js            # aplikasi Express + seluruh endpoint API
│   ├── db.js               # inisialisasi SQLite, hashing, seed data
│   └── data/kejari.db      # database (dibuat otomatis saat server jalan)
├── src/
│   ├── main.jsx
│   ├── index.css           # Tailwind + design token (warna, font)
│   ├── App.jsx             # router: / -> Home, /admin -> Admin
│   ├── lib/api.js          # klien API + KONTEN_DEFAULT (fallback)
│   └── pages/
│       ├── Home.jsx        # landing page (fetch /api/konten)
│       └── Admin.jsx       # panel admin (login + CRUD)
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
