<?php
require_once __DIR__ . '/inc/header.php';

// ==========================================
// PROSES SIMPAN PENGATURAN TEKS
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    $fields = [
        'hero_deskripsi',
        'hero_kutipan',
        'tentang_deskripsi',
        'cta_judul',
        'cta_deskripsi',
        'alamat'
    ];

    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?) ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");

        foreach ($fields as $k) {
            $val = trim($_POST[$k] ?? '');
            $stmt->execute([$k, $val]);
        }

        $pdo->commit();
        set_flash('success', 'Pengaturan teks website berhasil disimpan dan langsung tampil di halaman utama.');
        header('Location: pengaturan.php');
        exit;
    } catch (Exception $e) {
        $pdo->rollBack();
        set_flash('error', 'Gagal menyimpan pengaturan: ' . $e->getMessage());
    }
}

$pengaturan = get_pengaturan($pdo);
?>

<!-- Header Toolbar -->
<div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Teks Website</h1>
    <p class="text-sm text-slate-500 mt-1">Sesuaikan konten teks sambutan, profil tentang kami, CTA, dan alamat kantor.</p>
</div>

<div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-4xl">
    <form method="POST" action="pengaturan.php" class="space-y-6">
        <?= csrf_field() ?>

        <!-- Bagian Hero Banner -->
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#c9a227] pb-2 border-b border-slate-100 mb-4">
                1. Bagian Hero / Sambutan Utama
            </h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Deskripsi Singkat Hero
                    </label>
                    <textarea name="hero_deskripsi" rows="3" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($pengaturan['hero_deskripsi']) ?></textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Kutipan / Slogan di Kartu Foto Hero
                    </label>
                    <input type="text" name="hero_kutipan" value="<?= e($pengaturan['hero_kutipan']) ?>"
                           class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
                </div>
            </div>
        </div>

        <!-- Bagian Tentang Kami -->
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#c9a227] pb-2 border-b border-slate-100 mb-4">
                2. Bagian Tentang Kami
            </h3>
            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Deskripsi Profil Kejaksaan
                </label>
                <textarea name="tentang_deskripsi" rows="4" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($pengaturan['tentang_deskripsi']) ?></textarea>
            </div>
        </div>

        <!-- Bagian Call to Action (CTA) Kontak -->
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#c9a227] pb-2 border-b border-slate-100 mb-4">
                3. Banner Ajakan / Kontak (CTA)
            </h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Judul Utama Banner CTA
                    </label>
                    <textarea name="cta_judul" rows="2" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($pengaturan['cta_judul']) ?></textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Deskripsi Penjelas CTA
                    </label>
                    <textarea name="cta_deskripsi" rows="2" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($pengaturan['cta_deskripsi']) ?></textarea>
                </div>
            </div>
        </div>

        <!-- Bagian Alamat & Footer -->
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#c9a227] pb-2 border-b border-slate-100 mb-4">
                4. Alamat Kantor & Footer
            </h3>
            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Alamat Lengkap Kantor
                </label>
                <textarea name="alamat" rows="3" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($pengaturan['alamat']) ?></textarea>
            </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" class="px-6 py-3 rounded-xl font-bold text-sm bg-[#c9a227] hover:brightness-105 text-[#0d2818] shadow-sm transition flex items-center gap-2 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                Simpan Seluruh Pengaturan
            </button>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/inc/footer.php'; ?>
