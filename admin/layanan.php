<?php
require_once __DIR__ . '/inc/header.php';

$gambar_list = list_gambar_tersedia(true);

// ==========================================
// PROSES HAPUS LAYANAN
// ==========================================
if (isset($_POST['action']) && $_POST['action'] === 'hapus') {
    verify_csrf();
    $id = (int)($_POST['id'] ?? 0);
    $stmt = $pdo->prepare("DELETE FROM layanan WHERE id = ?");
    $stmt->execute([$id]);
    set_flash('success', 'Layanan berhasil dihapus.');
    header('Location: layanan.php');
    exit;
}

// ==========================================
// PROSES SIMPAN / EDIT LAYANAN
// ==========================================
if (isset($_POST['action']) && ($_POST['action'] === 'tambah' || $_POST['action'] === 'edit')) {
    verify_csrf();
    $id = (int)($_POST['id'] ?? 0);
    $judul = trim($_POST['judul'] ?? '');
    $deskripsi = trim($_POST['deskripsi'] ?? '');
    $gambar = trim($_POST['gambar'] ?? 'assets/images/barang-bukti.jpg');

    if (empty($judul)) {
        set_flash('error', 'Nama layanan wajib diisi.');
    } else {
        if ($_POST['action'] === 'tambah') {
            $stmt = $pdo->prepare("INSERT INTO layanan (judul, deskripsi, gambar) VALUES (?, ?, ?)");
            $stmt->execute([$judul, $deskripsi, $gambar]);
            set_flash('success', 'Layanan baru berhasil ditambahkan.');
        } else {
            $stmt = $pdo->prepare("UPDATE layanan SET judul = ?, deskripsi = ?, gambar = ? WHERE id = ?");
            $stmt->execute([$judul, $deskripsi, $gambar, $id]);
            set_flash('success', 'Layanan berhasil diperbarui.');
        }
        header('Location: layanan.php');
        exit;
    }
}

// Daftar Layanan
$stmt = $pdo->query("SELECT * FROM layanan ORDER BY id ASC");
$daftar_layanan = $stmt->fetchAll();

// Cek Edit Mode
$edit_data = null;
if (isset($_GET['edit'])) {
    $edit_id = (int)$_GET['edit'];
    $st = $pdo->prepare("SELECT * FROM layanan WHERE id = ?");
    $st->execute([$edit_id]);
    $edit_data = $st->fetch();
}
?>

<!-- Header Toolbar -->
<div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Kelola Layanan Publik</h1>
        <p class="text-sm text-slate-500 mt-1">Atur kartu program layanan unggulan kejaksaan bagi masyarakat.</p>
    </div>
    <div>
        <button onclick="openModal('modalFormLayanan')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#c9a227] text-[#0d2818] shadow-sm hover:brightness-105 transition cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Tambah Layanan
        </button>
    </div>
</div>

<!-- Table Card -->
<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                    <th class="px-6 py-4">Foto</th>
                    <th class="px-6 py-4">Nama Layanan</th>
                    <th class="px-6 py-4">Deskripsi</th>
                    <th class="px-6 py-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                <?php if (empty($daftar_layanan)): ?>
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-slate-400">Belum ada layanan yang ditambahkan.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($daftar_layanan as $l): ?>
                    <tr class="hover:bg-slate-50/80 transition">
                        <td class="px-6 py-4 w-24">
                            <img src="<?= get_gambar_url($l['gambar'], true) ?>" alt="" class="w-16 h-12 rounded-lg object-cover border border-slate-200" />
                        </td>
                        <td class="px-6 py-4 font-bold text-slate-900 leading-snug">
                            <?= e($l['judul']) ?>
                        </td>
                        <td class="px-6 py-4 text-xs text-slate-600 max-w-md">
                            <?= e($l['deskripsi']) ?>
                        </td>
                        <td class="px-6 py-4 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end gap-2">
                                <a href="layanan.php?edit=<?= $l['id'] ?>" class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition" title="Edit">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                </a>
                                <form method="POST" action="layanan.php" onsubmit="return confirm('Hapus layanan ini secara permanen?');" class="inline">
                                    <?= csrf_field() ?>
                                    <input type="hidden" name="action" value="hapus">
                                    <input type="hidden" name="id" value="<?= $l['id'] ?>">
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

<!-- ================= MODAL TAMBAH / EDIT LAYANAN ================= -->
<div id="modalFormLayanan" class="<?= ($edit_data || isset($_GET['action'])) ? '' : 'hidden' ?> fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-slate-100 my-8">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 class="font-bold text-slate-900 text-lg">
                <?= $edit_data ? 'Edit Layanan' : 'Tambah Layanan Baru' ?>
            </h3>
            <a href="layanan.php" class="text-slate-400 hover:text-slate-600 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </a>
        </div>

        <form method="POST" action="layanan.php" class="space-y-4">
            <?= csrf_field() ?>
            <input type="hidden" name="action" value="<?= $edit_data ? 'edit' : 'tambah' ?>">
            <?php if ($edit_data): ?>
                <input type="hidden" name="id" value="<?= $edit_data['id'] ?>">
            <?php endif; ?>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Nama Layanan *</label>
                <input type="text" name="judul" required value="<?= e($edit_data['judul'] ?? '') ?>" placeholder="Contoh: Halo JPN (Jaksa Pengacara Negara)"
                       class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Deskripsi Layanan *</label>
                <textarea name="deskripsi" rows="3" required placeholder="Jelaskan fasilitas atau cara kerja layanan ini..."
                          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"><?= e($edit_data['deskripsi'] ?? '') ?></textarea>
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Pilih Gambar Kartu Layanan</label>
                <select name="gambar" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]">
                    <?php 
                    $selected_img = $edit_data['gambar'] ?? 'assets/images/barang-bukti.jpg';
                    foreach ($gambar_list as $img_path): 
                        $val = str_replace('../', '', $img_path);
                        $is_sel = ($val === $selected_img || '/' . basename($val) === $selected_img);
                    ?>
                        <option value="<?= e($val) ?>" <?= $is_sel ? 'selected' : '' ?>>
                            <?= basename($val) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <a href="layanan.php" class="px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition">
                    Batal
                </a>
                <button type="submit" class="px-5 py-2.5 text-sm font-bold rounded-xl bg-[#c9a227] hover:brightness-105 text-[#0d2818] shadow-sm transition">
                    <?= $edit_data ? 'Simpan Perubahan' : 'Tambah Layanan' ?>
                </button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/inc/footer.php'; ?>
