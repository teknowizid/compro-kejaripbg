# Panduan Praktis Deploy ke Shared Hosting cPanel

Website profil **Kejaksaan Negeri Purbalingga (Versi PHP Murni)** ini dirancang agar **langsung jalan (zero-dependency)** di shared hosting cPanel tanpa memerlukan Node.js, NPM, Composer, ataupun terminal SSH.

---

### Langkah 1: Buat Database MySQL di cPanel
1. Masuk ke cPanel hosting Anda.
2. Buka menu **MySQL® Databases** (atau **MySQL Database Wizard**).
3. Buat database baru (misal: `u1234_kejari`).
4. Buat user database baru (misal: `u1234_admin`) dan buat password yang kuat.
5. Tambahkan user tersebut ke database dengan mencentang **ALL PRIVILEGES** (Semua Hak Akses).

---

### Langkah 2: Import Database SQL
1. Kembali ke halaman utama cPanel, klik **phpMyAdmin**.
2. Pilih nama database yang baru dibuat di panel sebelah kiri.
3. Klik tab **Import** di bagian atas.
4. Klik tombol **Choose File** dan pilih file **`database.sql`**.
5. Gulir ke bawah lalu klik **Import / Go**. Semua tabel, data profil, dan akun admin awal akan otomatis terisi.

---

### Langkah 3: Sesuaikan Koneksi Database di `koneksi.php`
Buka file `koneksi.php` menggunakan editor teks (atau via File Manager cPanel), sesuaikan 4 baris ini:

```php
$db_host = 'localhost';          // Biasanya tetap 'localhost' atau '127.0.0.1'
$db_name = 'u1234_kejari';       // Ganti dengan nama database cPanel Anda
$db_user = 'u1234_admin';        // Ganti dengan username database cPanel Anda
$db_pass = 'PasswordAnda123!';   // Ganti dengan password database cPanel Anda
```

---

### Langkah 4: Upload File ke `public_html`
1. Di laptop Anda, pilih semua file & folder di dalam folder `php-app` ini, lalu klik kanan ➔ **Compress to ZIP** (beri nama misal `web-kejari.zip`).
2. Di cPanel, buka **File Manager** ➔ masuk ke folder **`public_html`**.
3. Klik tombol **Upload** di toolbar atas dan pilih file `web-kejari.zip`.
4. Setelah proses upload selesai (100%), klik kanan file `web-kejari.zip` di File Manager ➔ pilih **Extract**.
5. Hapus file zip-nya agar hemat ruang penyimpanan.

---

### Langkah 5: Selesai! Uji Website Anda
1. Buka domain Anda di browser: `https://domainanda.com`
2. Buka panel admin CMS: `https://domainanda.com/admin/login.php`
   - **Username**: `admin`
   - **Password Default**: `admin123`
3. Masuk ke menu **Ganti Password** untuk segera mengganti kata sandi admin default.
