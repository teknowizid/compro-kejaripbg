<?php
require_once __DIR__ . '/inc/header.php';

// Ambil statistik ringkas
$count_berita = (int)$pdo->query("SELECT COUNT(*) FROM berita")->fetchColumn();
$count_layanan = (int)$pdo->query("SELECT COUNT(*) FROM layanan")->fetchColumn();
$count_testimoni = (int)$pdo->query("SELECT COUNT(*) FROM testimoni")->fetchColumn();

// Berita terbaru
$recent_berita = $pdo->query("SELECT * FROM berita ORDER BY tanggal DESC, id DESC LIMIT 5")->fetchAll();
?>

<!-- Header Section -->
<div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p class="text-sm text-slate-500 mt-1">Selamat datang di Content Management System Kejaksaan Negeri Purbalingga.</p>
    </div>
    <div class="flex gap-2">
        <a href="berita.php?action=tambah" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#c9a227] text-[#0d2818] shadow-sm hover:brightness-105 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Tulis Berita Baru
        </a>
    </div>
</div>

<!-- Stats Grid -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-[#c9a227] flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>
        </div>
        <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Berita</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1"><?= $count_berita ?></p>
        </div>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>
        </div>
        <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Layanan Publik</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1"><?= $count_layanan ?></p>
        </div>
    </div>

    <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
        </div>
        <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Testimoni Warga</p>
            <p class="text-3xl font-extrabold text-slate-900 mt-1"><?= $count_testimoni ?></p>
        </div>
    </div>
</div>

<!-- Recent News Section -->
<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="font-bold text-slate-800 text-sm">Berita & Kegiatan Terbaru</h2>
        <a href="berita.php" class="text-xs font-semibold text-[#c9a227] hover:underline">Kelola Semua Berita →</a>
    </div>

    <div class="divide-y divide-slate-100">
        <?php if (empty($recent_berita)): ?>
            <div class="p-8 text-center text-sm text-slate-400">Belum ada data berita.</div>
        <?php else: ?>
            <?php foreach ($recent_berita as $b): ?>
            <div class="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition gap-4">
                <div class="flex items-center gap-4 min-w-0">
                    <img src="<?= get_gambar_url($b['gambar'], true) ?>" alt="" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200">
                    <div class="min-w-0">
                        <p class="font-bold text-slate-900 text-sm truncate"><?= e($b['judul']) ?></p>
                        <p class="text-xs text-slate-500 mt-1"><?= tanggal_indo($b['tanggal']) ?></p>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <a href="berita.php?edit=<?= $b['id'] ?>" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                        Edit
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/inc/footer.php'; ?>
