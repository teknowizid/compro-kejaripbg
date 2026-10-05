-- =========================================================
-- DATABASE SCHEMA & INITIAL DATA: KEJAKSAAN NEGERI PURBALINGGA
-- Siap import langsung via phpMyAdmin cPanel (MySQL / MariaDB)
-- =========================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

-- --------------------------------------------------------
-- 1. Tabel Administrator
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Default: username: admin, password: admin123
INSERT INTO `admin` (`id`, `username`, `password_hash`) VALUES
(1, 'admin', '$2y$10$2HCyEf0WafiJEhZ3ukC9pek4DRGtL89aBDhFYpIKBVWBlwavQHHbm')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- --------------------------------------------------------
-- 2. Tabel Berita & Kegiatan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `berita` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `ringkasan` text NOT NULL,
  `gambar` varchar(255) NOT NULL DEFAULT 'assets/images/upacara.jpg',
  `tanggal` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_berita_tanggal` (`tanggal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `berita` (`id`, `judul`, `ringkasan`, `gambar`, `tanggal`) VALUES
(1, 'Upacara Peringatan Hari Lahir Kejaksaan Republik Indonesia', 'Kejaksaan Negeri Purbalingga melaksanakan upacara peringatan hari lahir Kejaksaan RI dengan khidmat dan penuh semangat.', 'assets/images/upacara.jpg', '2026-09-12'),
(2, 'Sosialisasi Hukum di Sekolah', 'Kejaksaan Negeri Purbalingga memberikan edukasi hukum kepada pelajar sebagai upaya pencegahan pelanggaran hukum sejak dini.', 'assets/images/sekolah.jpg', '2026-09-08'),
(3, 'Penguatan Zona Integritas', 'Kejaksaan Negeri Purbalingga berkomitmen mewujudkan Wilayah Birokrasi Bersih dan Melayani (WBBM).', 'assets/images/gedung.jpg', '2026-09-01')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- --------------------------------------------------------
-- 3. Tabel Layanan Publik
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `layanan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` varchar(255) NOT NULL DEFAULT 'assets/images/barang-bukti.jpg',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `layanan` (`id`, `judul`, `deskripsi`, `gambar`) VALUES
(1, 'Pelayanan Antar Barang Bukti (LANTINGBARLING)', 'Layanan antar barang bukti yang telah berkekuatan hukum tetap kepada pemiliknya secara gratis.', 'assets/images/barang-bukti.jpg'),
(2, 'Halo JPN (Jaksa Pengacara Negara)', 'Layanan konsultasi hukum dan bantuan hukum oleh Jaksa Pengacara Negara untuk masyarakat.', 'assets/images/konsultasi.jpg'),
(3, 'SIBETA (Surat Izin Besuk Tahanan)', 'Layanan permohonan izin besuk tahanan secara mudah, cepat, dan transparan.', 'assets/images/besuk.jpg')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- --------------------------------------------------------
-- 4. Tabel Testimoni Masyarakat
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimoni` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `peran` varchar(255) NOT NULL DEFAULT '',
  `kutipan` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `testimoni` (`id`, `nama`, `peran`, `kutipan`) VALUES
(1, 'Andi Prabowo', 'Masyarakat', 'Layanan yang diberikan sangat profesional dan membantu, saya memahami hak-hak saya dalam proses hukum yang rumit.')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- --------------------------------------------------------
-- 5. Tabel Pengaturan Teks Website (Key-Value)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pengaturan` (
  `kunci` varchar(100) NOT NULL,
  `nilai` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`kunci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pengaturan` (`kunci`, `nilai`) VALUES
('hero_deskripsi', 'Kami hadir untuk menegakkan hukum, melindungi kepentingan masyarakat, dan mewujudkan keadilan di Kabupaten Purbalingga.'),
('hero_kutipan', 'Kejaksaan hadir untuk masyarakat, demi hukum yang berkeadilan.'),
('tentang_deskripsi', 'Kejaksaan Negeri Purbalingga adalah lembaga penegak hukum yang berkomitmen menegakkan supremasi hukum, melindungi kepentingan umum, dan memberikan pelayanan hukum yang profesional, transparan, dan berkeadilan pada kepentingan masyarakat.'),
('cta_judul', 'Dapatkan Layanan Hukum\ndan Informasi Terpercaya'),
('cta_deskripsi', 'Hubungi kami sekarang untuk mendapatkan informasi dan layanan yang kamu butuhkan.'),
('alamat', 'Jalan Jendral Sudirman No. 93A,\nPurbalingga, Jawa Tengah 53311')
ON DUPLICATE KEY UPDATE `nilai`=VALUES(`nilai`);

SET FOREIGN_KEY_CHECKS=1;
