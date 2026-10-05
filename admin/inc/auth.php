<?php
/**
 * Guard Autentikasi Admin & Proteksi CSRF
 */

require_once __DIR__ . '/../../koneksi.php';

// Pastikan user sudah login
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

// Generate CSRF token jika belum ada
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function csrf_token() {
    return $_SESSION['csrf_token'] ?? '';
}

function csrf_field() {
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(csrf_token(), ENT_QUOTES, 'UTF-8') . '">';
}

function verify_csrf() {
    $token = $_POST['csrf_token'] ?? $_GET['csrf_token'] ?? '';
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        die('
        <div style="font-family:sans-serif; max-width:500px; margin:50px auto; padding:20px; background:#fee2e2; border:1px solid #ef4444; border-radius:8px; color:#991b1b;">
            <h4 style="margin-top:0;">⚠️ Validasi Keamanan Gagal (Invalid CSRF Token)</h4>
            <p>Sesi Anda telah kedaluwarsa atau token tidak valid. Silakan kembali dan muat ulang halaman.</p>
        </div>
        ');
    }
}
