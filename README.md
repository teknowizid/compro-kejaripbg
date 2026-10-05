# Website Kejaksaan Negeri Purbalingga (Versi PHP Murni & Zero-Dependency)

Website profil resmi **Kejaksaan Negeri Purbalingga** yang dibangun secara murni menggunakan **PHP (PHP 7.4 s.d. 8.3+)**, **Tailwind CSS**, dan **MySQL**. Dilengkapi **Panel Admin CMS Terpadu** sehingga seluruh konten berita, layanan, testimoni, dan teks profil institusi dapat dikelola langsung tanpa coding.

Dirancang khusus untuk **kemudahan deployment di shared hosting (cPanel)**:
- **Zero-Dependency**: Tidak butuh Node.js, NPM, Composer, ataupun terminal SSH.
- **Ringan & Cepat**: Total ukuran seluruh website hanya **~1,6 MB** (termasuk 8 foto aset).
- **Aman Berstandar OWASP**: Dilengkapi proteksi SQL Injection (PDO Prepared Statements), Bcrypt hashing, proteksi sesi, CSRF tokens, dan pencegahan XSS.

---

## 🏛️ Arsitektur & Struktur Folder

```text
php-app/
├── index.php             # Halaman publik utama (10 section: Hero, Layanan, Berita, dll)
├── koneksi.php           # Koneksi database aman PDO MySQL & helper keamanan
├── database.sql          # Skema basis data & data awal (siap import phpMyAdmin)
├── .htaccess             # Header keamanan Apache & proteksi file sensitif
├── README-CPANEL.md      # Panduan instalasi cepat 5 menit di cPanel
├── assets/
│   ├── css/style.css     # Styling Tailwind CSS lengkap
│   └── images/           # Aset gambar resmi lokal (hero, gedung, barang bukti, dll)
└── admin/                # Panel Admin CMS
    ├── login.php         # Halaman login administrator
    ├── logout.php        # Hapus sesi login
    ├── index.php         # Dashboard ringkasan & statistik
    ├── berita.php        # Kelola berita & kegiatan (CRUD + Pencarian)
    ├── layanan.php       # Kelola program layanan masyarakat (CRUD)
    ├── testimoni.php     # Kelola ulasan & testimoni warga (CRUD)
    ├── pengaturan.php    # Pengaturan teks profil, hero, CTA, & alamat
    ├── akun.php          # Ganti kata sandi administrator
    └── inc/
        ├── auth.php      # Middleware session guard & verifikasi CSRF
        ├── header.php    # Sidebar navigasi & header admin
        └── footer.php    # Modal script & penutup layout
```

---

## 🔒 Standar Keamanan

1. **Anti SQL Injection**: 100% interaksi database menggunakan **PDO Prepared Statements** dengan parameter binding.
2. **Password Enkripsi**: Menggunakan standar industri **`PASSWORD_BCRYPT`** bawaan PHP (`password_hash` & `password_verify`).
3. **Anti Session Hijacking**: Otomatis menjalankan `session_regenerate_id(true)` saat proses autentikasi berhasil.
4. **Anti XSS (Cross-Site Scripting)**: Semua output data yang dicetak ke layar HTML disaring ketat melalui `htmlspecialchars()`.
5. **Anti CSRF (Cross-Site Request Forgery)**: Seluruh aksi formulir tambah, edit, dan hapus di admin dilindungi token CSRF per sesi.
6. **Proteksi File Sensitif Apache**: Konfigurasi `.htaccess` memblokir pengunduhan langsung file `database.sql`, `.env`, dan mencegah intip folder (*Directory Listing*).

---

## 🚀 Panduan Menjalankan

### Opsi A — Di Shared Hosting cPanel (Produksi)
1. Buat database & user MySQL di cPanel (**MySQL Databases**).
2. Buka **phpMyAdmin**, pilih database tersebut, lalu klik tab **Import** dan pilih file `database.sql`.
3. Buka file `koneksi.php`, sesuaikan nama database, user, dan password MySQL Anda.
4. Upload semua file dalam folder `php-app` ini ke dalam folder `public_html` via File Manager cPanel, lalu ekstrak.
5. Selesai! Buka domain Anda di browser.

### Opsi B — Di Laptop / Komputer Lokal (XAMPP / Laragon / PHP CLI)
Jika menggunakan built-in web server PHP:
```bash
# Masuk ke folder php-app
cd php-app

# Jalankan server lokal
php -S localhost:8000
```
Buka browser di `http://localhost:8000`.

---

## 🗄️ Kamus Data & Model Basis Data Terstruktur

Seluruh struktur basis data MySQL didokumentasikan secara terpusat di bawah ini. **Setiap perubahan skema basis data (penambahan/modifikasi tabel maupun kolom) WAJIB mengikuti protokol pencatatan terstruktur.**

### 1. Tabel `admin` (Autentikasi Administrator)
| Nama Kolom | Tipe Data MySQL | Nullable | Default | Keterangan / Fungsi |
|---|---|---|---|---|
| `id` | `INT(11)` | NO | AUTO_INCREMENT / PK | ID unik administrator |
| `username` | `VARCHAR(100)` | NO | - | Username login (UNIQUE constraint, indexed) |
| `password_hash` | `VARCHAR(255)` | NO | - | Hash kata sandi terenkripsi (bcrypt) |
| `created_at` | `TIMESTAMP` | NO | CURRENT_TIMESTAMP | Waktu pendaftaran akun |

### 2. Tabel `berita` (Publikasi Berita & Agenda Kegiatan)
| Nama Kolom | Tipe Data MySQL | Nullable | Default | Keterangan / Fungsi |
|---|---|---|---|---|
| `id` | `INT(11)` | NO | AUTO_INCREMENT / PK | ID unik berita |
| `judul` | `VARCHAR(255)` | NO | - | Judul artikel / kegiatan resmi |
| `ringkasan` | `TEXT` | NO | `''` | Ulasan singkat / cuplikan isi berita |
| `gambar` | `VARCHAR(255)` | NO | `'assets/images/upacara.jpg'` | Path aset gambar cover lokal |
| `tanggal` | `VARCHAR(10)` | NO | `''` | Tanggal kegiatan format ISO `YYYY-MM-DD` (Indexed) |
| `created_at` | `TIMESTAMP` | NO | CURRENT_TIMESTAMP | Stempel waktu pembuatan baris data |

### 3. Tabel `layanan` (Daftar Layanan Publik Unggulan)
| Nama Kolom | Tipe Data MySQL | Nullable | Default | Keterangan / Fungsi |
|---|---|---|---|---|
| `id` | `INT(11)` | NO | AUTO_INCREMENT / PK | ID unik layanan |
| `judul` | `VARCHAR(255)` | NO | - | Nama layanan (misal: LANTINGBARLING, Halo JPN) |
| `deskripsi` | `TEXT` | NO | `''` | Uraian fasilitas dan prosedur layanan |
| `gambar` | `VARCHAR(255)` | NO | `'assets/images/barang-bukti.jpg'` | Path ilustrasi kartu layanan |
| `created_at` | `TIMESTAMP` | NO | CURRENT_TIMESTAMP | Stempel waktu pembuatan |

### 4. Tabel `testimoni` (Ulasan Kepuasan Masyarakat)
| Nama Kolom | Tipe Data MySQL | Nullable | Default | Keterangan / Fungsi |
|---|---|---|---|---|
| `id` | `INT(11)` | NO | AUTO_INCREMENT / PK | ID unik testimoni |
| `nama` | `VARCHAR(255)` | NO | - | Nama lengkap pemberi testimoni |
| `peran` | `VARCHAR(255)` | NO | `''` | Profesi, lembaga, atau status warga |
| `kutipan` | `TEXT` | NO | `''` | Kalimat ulasan / apresiasi pelayanan |
| `created_at` | `TIMESTAMP` | NO | CURRENT_TIMESTAMP | Stempel waktu pembuatan |

### 5. Tabel `pengaturan` (Konfigurasi Teks Konten Dinamis - Key-Value)
| Nama Kolom | Tipe Data MySQL | Nullable | Default | Keterangan / Fungsi |
|---|---|---|---|---|
| `kunci` | `VARCHAR(100)` | NO | PRIMARY KEY | Identifier kunci pengaturan (cth: `hero_deskripsi`) |
| `nilai` | `TEXT` | NO | `''` | Teks nilai konfigurasi profil web |
| `updated_at` | `TIMESTAMP` | NO | CURRENT_TIMESTAMP ON UPDATE | Stempel waktu pembaruan terakhir |

---

## 📋 Protokol & Standar Perubahan Basis Data

Setiap perubahan pada skema basis data (baik menambah tabel baru, mengubah tipe kolom, menambah kolom, maupun menghapus kolom) **wajib mengikuti langkah terstruktur berikut**:

1. **Konvensi Penamaan**:
   - Nama tabel menggunakan huruf kecil (*lowercase*), bentuk kata tunggal (*singular*), snake_case: misal `berita`, `layanan`.
   - Nama kolom menggunakan `snake_case`: misal `nomor_surat`, `tanggal_mulai`.
   - Primary key bernama `id` (tipe integer auto increment).
   - Index diawali dengan `idx_<tabel>_<kolom>`.
2. **Pembaruan Berkas DDL**:
   - Perbarui skema DDL di `database.sql` agar instalasi baru mendapatkan struktur terbaru.
   - Sediakan instruksi `ALTER TABLE` pada log perubahan agar basis data produksi dapat di-upgrade tanpa menghapus data yang sudah ada.
3. **Penyelarasan Kode PHP**:
   - Selaraskan query PDO prepared statement di file terkait (`koneksi.php`, file admin CRUD).
   - Perbarui formulir input dan tabel tampilan antarmuka admin.
4. **Pencatatan Riwayat (Wajib)**:
   - Tambahkan entri pada **Tabel Log Riwayat Perubahan Skema Basis Data** di bawah ini dan di `CHANGELOG.md`.

### Tabel Log Riwayat Perubahan Skema Basis Data

| No | Tanggal | Versi | Tabel Terdampak | Perubahan (Kolom / Index / Constraint) | Rationale / Tujuan Bisnis |
|---|---|---|---|---|---|
| 1 | 2026-10-01 | 1.1.0 | `admin`, `sesi`, `berita`, `layanan`, `testimoni`, `pengaturan` | Inisialisasi skema awal (6 tabel) | Peluncuran baseline CMS dynamic content |
| 2 | 2026-10-01 | 1.3.0 | Seluruh tabel | Standarisasi dual-driver Knex ORM (SQLite & MySQL) + indexing | Skalabilitas database menuju MySQL staging/prod |
| 3 | 2026-10-05 | 2.0.0 | Seluruh tabel | Porting DDL ke MySQL InnoDB `utf8mb4_unicode_ci` murni (`database.sql`) | Dukungan hosting cPanel tanpa ketergantungan Node.js |

---

## 🔑 Akun Administrator Default

- **URL Login Admin**: `http://domainanda.com/admin/login.php`
- **Username**: `admin`
- **Password**: `admin123`
- *Catatan: Segera perbarui password melalui menu **Ganti Password** setelah pertama kali login.*

