<?php
require_once __DIR__ . '/inc/header.php';

// ==========================================
// PROSES HAPUS TESTIMONI
// ==========================================
if (isset($_POST['action']) && $_POST['action'] === 'hapus') {
    verify_csrf();
    $id = (int)($_POST['id'] ?? 0);
    $stmt = $pdo->prepare("DELETE FROM testimoni WHERE id = ?");
    $stmt->execute([$id]);
    set_flash('success', 'Testimoni berhasil dihapus.');
    header('Location: testimoni.php');
    exit;
}

// ==========================================
// PROSES SIMPAN / EDIT TESTIMONI
// ==========================================
if (isset($_POST['action']) && ($_POST['action'] === 'tambah' || $_POST['action'] === 'edit')) {
    verify_csrf();
    $id = (int)($_POST['id'] ?? 0);
    $nama = trim($_POST['nama'] ?? '');
    $peran = trim($_POST['peran'] ?? '');
    $kutipan = trim($_POST['kutipan'] ?? '');

    if (empty($nama) || empty($kutipan)) {
        set_flash('error', 'Nama dan kutipan testimoni wajib diisi.');
    } else {
        if ($_POST['action'] === 'tambah') {
            $stmt = $pdo->prepare("INSERT INTO testimoni (nama, peran, kutipan) VALUES (?, ?, ?)");
            $stmt->execute([$nama, $peran, $kutipan]);
            set_flash('success', 'Testimoni baru berhasil ditambahkan.');
        } else {
            $stmt = $pdo->prepare("UPDATE testimoni SET nama = ?, peran = ?, kutipan = ? WHERE id = ?");
            $stmt->execute([$nama, $peran, $kutipan, $id]);
            set_flash('success', 'Testimoni berhasil diperbarui.');
        }
        header('Location: testimoni.php');
        exit;
    }
}

// Daftar Testimoni
$stmt = $pdo->query("SELECT * FROM testimoni ORDER BY id DESC");
$daftar_testimoni = $stmt->fetchAll();

// Cek Edit Mode
$edit_data = null;
if (isset($_GET['edit'])) {
    $edit_id = (int)$_GET['edit'];
    $st = $pdo->prepare("SELECT * FROM testimoni WHERE id = ?");
    $st->execute([$edit_id]);
    $edit_data = $st->fetch();
}
?>

<!-- Header Toolbar -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Kelola Testimoni</h1>
        <p class="text-sm text-slate-500 mt-1">Ulasan kepuasan dan apresiasi masyarakat atas pelayanan Kejaksaan.</p>
    </div>
    <div>
        <button onclick="openModal('modalFormTestimoni')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#c9a227] text-[#0d2818] shadow-sm hover:brightness-105 transition cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Tambah Testimoni
        </button>
    </div>
</div>

<!-- Table Card -->
<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                    <th class="px-6 py-4">Nama Pemberi Testimoni</th>
                    <th class="px-6 py-4">Peran / Profesi</th>
                    <th class="px-6 py-4">Kutipan Testimoni</th>
                    <th class="px-6 py-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                <?php if (empty($daftar_testimoni)): ?>
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-slate-400">Belum ada testimoni.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($daftar_testimoni as $t): ?>
                    <tr class="hover:bg-slate-50/80 transition">
                        <td class="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                            <?= e($t['nama']) ?>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">
                            <?= e($t['peran'] ?: 'Masyarakat') ?>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600 italic max-w-md">
                            “<?= e($t['kutipan']) ?>”
                        </td>
                        <td class="px-6 py-4 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end gap-2">
                                <a href="testimoni.php?edit=<?= $t['id'] ?>" class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition" title="Edit">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                </a>
                                <form method="POST" action="testimoni.php" onsubmit="return confirm('Hapus testimoni ini secara permanen?');" class="inline">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="action" value="hapus">
                                    <input type="hidden" name="id" value="<?= $t['id'] ?>">
                                    <button type="submit" class="p-2 rounded-lg text-red-600 hover:bg-red-50 transition" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- ================= MODAL TAMBAH / EDIT TESTIMONI ================= -->
<div id="modalFormTestimoni" class="<?= ($edit_data || isset($_GET['action'])) ? '' : 'hidden' ?> fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-slate-100 my-8">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 class="font-bold text-slate-900 text-lg">
                <?= $edit_data ? 'Edit Testimoni' : 'Tambah Testimoni Baru' ?>
            </h3>
            <a href="testimoni.php" class="text-slate-400 hover:text-slate-600 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </a>
        </div>

        <form method="POST" action="testimoni.php" class="space-y-4">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="<?= $edit_data ? 'edit' : 'tambah' ?>">
            <?php if ($edit_data): ?>
                <input type="hidden" name="id" value="<?= $edit_data['id'] ?>">
            <?php endif; ?>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Nama Lengkap *</label>
                <input type="text" name="nama" required value="<?= e($edit_data['nama'] ?? '') ?>" placeholder="Contoh: Budi Santoso"
                       class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Peran / Profesi / Asal</label>
                <input type="text" name="peran" value="<?= e($edit_data['peran'] ?? '') ?>" placeholder="Contoh: Warga Purbalingga Lor / Pelaku Usaha"
                       class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Kutipan Testimoni *</label>
                <textarea name="kutipan" rows="4" required placeholder="Tuliskan ulasan atau apresiasi..."
                          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($edit_data['kutipan'] ?? '') ?></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <a href="testimoni.php" class="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition">
                    Batal
                </a>
                <button type="submit" class="px-5 py-2.5 text-sm font-bold rounded-xl bg-[#c9a227] hover:brightness-105 text-[#0d2818] shadow-sm transition">
                    <?= $edit_data ? 'Simpan Perubahan' : 'Tambah Testimoni' ?>
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/inc/footer.php'; ?>
