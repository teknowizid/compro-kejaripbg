# Changelog — Versi PHP

Semua perubahan penting pada versi PHP ini dicatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/).

---

## [2.0.0-php] - 2026-10-05

### Ditambahkan (Migrasi Penuh ke PHP Murni & MySQL)
- **Arsitektur Zero-Dependency**:
  - Menghapus sepenuhnya ketergantungan pada runtime Node.js, NPM, Vite, dan Composer pada saat proses deployment.
  - Kompatibel 100% dengan shared hosting Apache/Litespeed cPanel standar dengan konsumsi memori server sangat rendah.
- **Halaman Depan Publik (`index.php`)**:
  - Konversi lengkap dari komponen React JSX (`Home.jsx`) menjadi Server-Side Rendering (SSR) PHP murni.
  - Menyajikan 10 section terpadu: Navbar, Hero Banner, 6 Pintu Layanan Cepat, Tentang Kami, Layanan Unggulan, Berita & Kegiatan Terkini, Nilai Tri Krama Adhyaksa, Testimoni Warga, Banner Kontak (CTA), dan Footer Resmi.
  - Tampilan visual identik dengan desain asli menggunakan Tailwind CSS dan ikon SVG inline.
- **Panel Admin CMS Terpadu (`admin/`)**:
  - **Autentikasi Aman**: Halaman login (`login.php`) dengan hashing password `PASSWORD_BCRYPT`, proteksi sesi dengan `session_regenerate_id()`, dan sesi logout aman (`logout.php`).
  - **Dashboard Overview (`index.php`)**: Kartu statistik ringkasan total berita, layanan publik, dan testimoni masyarakat, serta pratinjau berita terbaru.
  - **CRUD Berita & Kegiatan (`berita.php`)**: Manajemen penambahan berita, formulir edit, penghapusan data, fitur pencarian instan (*search query*), dan pemilih cover gambar dari galeri lokal.
  - **CRUD Layanan Publik (`layanan.php`)**: Manajemen program dan fasilitas pelayanan hukum bagi masyarakat.
  - **CRUD Testimoni (`testimoni.php`)**: Manajemen ulasan, nama, profesi, dan kutipan kepuasan publik.
  - **Pengaturan Teks Website (`pengaturan.php`)**: Penyuntingan dinamis teks sambutan hero, kutipan inspiratif, profil tentang kami, ajakan kontak, dan alamat kantor dengan transaksi basis data PDO.
  - **Akun & Ganti Password (`akun.php`)**: Fasilitas pembaruan kata sandi admin dengan validasi password lama dan konfirmasi password baru (minimal 6 karakter).
- **Keamanan & Standar OWASP**:
  - Pencegahan **SQL Injection** secara menyeluruh dengan **PDO Prepared Statements**.
  - Pencegahan **XSS** pada setiap pencetakan data menggunakan fungsi sanitasi `e()` (`htmlspecialchars`).
  - Pencegahan **CSRF** pada seluruh formulir manipulasi data via token acak kriptografis per sesi.
  - File `.htaccess` siap pakai untuk melindungi akses langsung ke file sensitif (`database.sql`, `koneksi.php`) dan penegakan header keamanan HTTP.
- **Dokumentasi & Migrasi**:
  - Disediakan file skema dan data awal `database.sql` yang siap diimport langsung via phpMyAdmin.
  - Panduan lengkap `README.md` dan panduan khusus cPanel `README-CPANEL.md`.
