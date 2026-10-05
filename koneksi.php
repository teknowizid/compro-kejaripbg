<?php
/**
 * Koneksi Database PDO & Helper Keamanan
 * Kompatibel dengan PHP 7.4, 8.0, 8.1, 8.2, 8.3+
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ========================================================
// PARSER .ENV OTOMATIS (Zero-Dependency)
// ========================================================
$env_path = __DIR__ . '/.env';
if (file_exists($env_path)) {
    $lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val, " \t\n\r\0\x0B\"'");
            putenv("{$key}={$val}");
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;
        }
    }
}

// ========================================================
// KONFIGURASI DATABASE
// ========================================================
$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_name = getenv('DB_NAME') ?: 'kejari_db';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
$db_port = getenv('DB_PORT') ?: '3306';

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    // Tampilan error ramah jika database belum diimport / belum disetting
    die("
    <div style='font-family: sans-serif; max-width: 600px; margin: 60px auto; padding: 24px; border: 1px solid #f87171; background: #fef2f2; border-radius: 12px; color: #991b1b;'>
        <h3 style='margin-top:0;'>⚠️ Gagal Terhubung ke Database MySQL</h3>
        <p>Pastikan Anda telah membuat database di cPanel (atau XAMPP/Laragon) dan mengimport file <code>database.sql</code>.</p>
        <p><strong>Pesan Sistem:</strong> " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "</p>
        <p style='font-size: 13px; color: #475569;'>Buka file <code>koneksi.php</code> untuk menyesuaikan nama database, user, dan password.</p>
    </div>
    ");
}

// ========================================================
// HELPER KEAMANAN & UTILITAS
// ========================================================

/**
 * Mencegah XSS (Cross-Site Scripting) saat mencetak teks ke HTML
 */
function e($teks) {
    return htmlspecialchars((string)($teks ?? ''), ENT_QUOTES, 'UTF-8');
}

/**
 * Ambil seluruh pengaturan teks website dalam format array associative
 */
function get_pengaturan(PDO $pdo) {
    $defaults = [
        'hero_deskripsi'    => 'Kami hadir untuk menegakkan hukum, melindungi kepentingan masyarakat, dan mewujudkan keadilan di Kabupaten Purbalingga.',
        'hero_kutipan'      => 'Kejaksaan hadir untuk masyarakat, demi hukum yang berkeadilan.',
        'tentang_deskripsi' => 'Kejaksaan Negeri Purbalingga adalah lembaga penegak hukum yang berkomitmen menegakkan supremasi hukum, melindungi kepentingan umum, dan memberikan pelayanan hukum yang profesional, transparan, dan berkeadilan pada kepentingan masyarakat.',
        'cta_judul'         => "Dapatkan Layanan Hukum\ndan Informasi Terpercaya",
        'cta_deskripsi'     => 'Hubungi kami sekarang untuk mendapatkan informasi dan layanan yang kamu butuhkan.',
        'alamat'            => "Jalan Jendral Sudirman No. 93A,\nPurbalingga, Jawa Tengah 53311",
    ];

    try {
        $stmt = $pdo->query("SELECT kunci, nilai FROM pengaturan");
        $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        return array_merge($defaults, $rows ?: []);
    } catch (Exception $e) {
        return $defaults;
    }
}

/**
 * Normalisasi URL gambar agar selalu valid baik di root maupun subfolder
 */
function get_gambar_url($path, $subfolder = false) {
    $path = trim((string)$path);
    if (empty($path)) return ($subfolder ? '../' : '') . 'assets/images/hero.jpg';
    if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) return $path;

    // Bersihkan path
    $clean = ltrim($path, '/');
    if (strpos($clean, 'assets/images/') === 0) {
        return ($subfolder ? '../' : '') . $clean;
    }
    return ($subfolder ? '../' : '') . 'assets/images/' . $clean;
}

/**
 * Ambil daftar file gambar yang tersedia di assets/images/
 */
function list_gambar_tersedia($subfolder = false) {
    $dir = __DIR__ . '/assets/images';
    if (!is_dir($dir)) return [];
    $files = scandir($dir);
    $images = [];
    foreach ($files as $f) {
        if (preg_match('/\.(jpg|jpeg|png|webp|svg)$/i', $f)) {
            $images[] = ($subfolder ? '../' : '') . 'assets/images/' . $f;
        }
    }
    return $images;
}

/**
 * Ambil tanggal hari (angka) untuk badge berita (contoh: "2026-09-12" -> "12")
 */
function hari_dari_tanggal($iso) {
    if (preg_match('/(\d{4})-(\d{2})-(\d{2})/', (string)$iso, $m)) {
        return (int)$m[3];
    }
    return date('j');
}

/**
 * Format tanggal Indonesia lengkap (contoh: "12 September 2026")
 */
function tanggal_indo($iso) {
    if (empty($iso)) return '-';
    $bulan = [
        1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    $pecah = explode('-', $iso);
    if (count($pecah) === 3) {
        $tahun = $pecah[0];
        $bln = (int)$pecah[1];
        $tgl = (int)$pecah[2];
        return "{$tgl} " . ($bulan[$bln] ?? '') . " {$tahun}";
    }
    return $iso;
}

/**
 * Flash Notification Helper
 */
function set_flash($tipe, $pesan) {
    $_SESSION['flash'] = ['type' => $tipe, 'message' => $pesan];
}

function get_flash() {
    if (isset($_SESSION['flash'])) {
        $f = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $f;
    }
    return null;
}
