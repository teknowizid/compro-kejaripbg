<?php
require_once __DIR__ . '/auth.php';

// Mengetahui halaman aktif saat ini
$current_page = basename($_SERVER['PHP_SELF']);

$nav_items = [
    ['file' => 'index.php',      'title' => 'Dashboard',         'icon' => 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'],
    ['file' => 'berita.php',     'title' => 'Berita & Kegiatan', 'icon' => 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z'],
    ['file' => 'layanan.php',    'title' => 'Layanan Publik',    'icon' => 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z'],
    ['file' => 'testimoni.php',  'title' => 'Testimoni',         'icon' => 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'],
    ['file' => 'pengaturan.php', 'title' => 'Pengaturan Web',    'icon' => 'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'],
    ['file' => 'akun.php',       'title' => 'Ganti Password',    'icon' => 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'],
];

$flash = get_flash();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin CMS — Kejaksaan Negeri Purbalingga</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        emas: '#c9a227',
                        kejari: '#0d2818',
                        'kejari-dark': '#081b10',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-100 font-sans antialiased text-slate-800 min-h-screen flex flex-col md:flex-row selection:bg-[#c9a227] selection:text-[#0d2818]">

    <!-- ================= SIDEBAR ================= -->
    <aside class="w-full md:w-64 bg-[#0d2818] text-white shrink-0 flex flex-col justify-between shadow-2xl border-r border-white/5">
        <div>
            <!-- Header Brand -->
            <div class="p-6 border-b border-white/10 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0d2818] text-sm shrink-0"
                     style="background: linear-gradient(135deg, #c9a227, #e3b94e);">
                    KN
                </div>
                <div class="overflow-hidden">
                    <h2 class="font-bold text-sm tracking-tight text-white truncate">Kejari Purbalingga</h2>
                    <p class="text-[11px] font-medium text-[#c9a227]">Admin CMS Portal</p>
                </div>
            </div>

            <!-- Nav Links -->
            <nav class="p-4 space-y-1">
                <?php foreach ($nav_items as $item): 
                    $isActive = ($current_page === $item['file']);
                ?>
                <a href="<?= $item['file'] ?>"
                   class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition <?= $isActive ? 'bg-[#c9a227] text-[#0d2818] shadow-md font-bold' : 'text-slate-300 hover:bg-white/10 hover:text-white' ?>">
                    <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="<?= $item['icon'] ?>" />
                    </svg>
                    <span><?= $item['title'] ?></span>
                </a>
                <?php endforeach; ?>
            </nav>
        </div>

        <!-- Footer Sidebar -->
        <div class="p-4 border-t border-white/10">
            <a href="../index.php" target="_blank"
               class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition mb-2">
                <span>Lihat Website</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
            <a href="logout.php"
               onclick="return confirm('Apakah Anda yakin ingin logout?');"
               class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white transition">
                <span>Logout</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </a>
        </div>
    </aside>

    <!-- ================= MAIN CONTENT WRAPPER ================= -->
    <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- Top bar -->
        <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-semibold text-slate-500">CMS Online</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-slate-600">Login sebagai: <strong class="text-slate-900"><?= e($_SESSION['admin_username']) ?></strong></span>
            </div>
        </header>

        <!-- Body Area -->
        <div class="p-6 md:p-8 max-w-7xl w-full mx-auto">
            <?php if ($flash): ?>
                <div class="mb-6 p-4 rounded-xl border flex items-center justify-between text-sm <?= $flash['type'] === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200' ?>">
                    <div class="flex items-center gap-3">
                        <span class="w-2.5 h-2.5 rounded-full <?= $flash['type'] === 'success' ? 'bg-emerald-500' : 'bg-red-500' ?>"></span>
                        <p class="font-medium"><?= e($flash['message']) ?></p>
                    </div>
                </div>
            <?php endif; ?>
