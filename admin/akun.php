<?php
require_once __DIR__ . '/inc/header.php';

// ==========================================
// PROSES GANTI PASSWORD
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();

    $lama = (string)($_POST['lama'] ?? '');
    $baru = (string)($_POST['baru'] ?? '');
    $konfirmasi = (string)($_POST['konfirmasi'] ?? '');

    if (empty($lama) || empty($baru)) {
        set_flash('error', 'Semua kolom password wajib diisi.');
    } elseif (strlen($baru) < 6) {
        set_flash('error', 'Password baru minimal harus 6 karakter.');
    } elseif ($baru !== $konfirmasi) {
        set_flash('error', 'Konfirmasi password baru tidak cocok.');
    } else {
        // Ambil admin saat ini
        $stmt = $pdo->prepare("SELECT * FROM admin WHERE id = ? LIMIT 1");
        $stmt->execute([$_SESSION['admin_id']]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($lama, $admin['password_hash'])) {
            set_flash('error', 'Password lama yang Anda masukkan salah.');
        } else {
            // Update password baru dengan bcrypt
            $new_hash = password_hash($baru, PASSWORD_BCRYPT);
            $up = $pdo->prepare("UPDATE admin SET password_hash = ? WHERE id = ?");
            $up->execute([$new_hash, $_SESSION['admin_id']]);

            set_flash('success', 'Password admin berhasil diubah! Gunakan password baru untuk login berikutnya.');
            header('Location: akun.php');
            exit;
        }
    }
}
?>

<!-- Header Toolbar -->
<div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Akun & Keamanan</h1>
    <p class="text-sm text-slate-500 mt-1">Perbarui kata sandi akun administrator untuk menjaga keamanan website.</p>
</div>

<div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-xl">
    <div class="flex items-center gap-3 p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
        <svg class="w-5 h-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
        <p>Gunakan kombinasi password yang kuat dan jangan bagikan kredensial ini kepada pihak yang tidak berwenang.</p>
    </div>

    <form method="POST" action="akun.php" class="space-y-4">
        <?= csrf_field() ?>

        <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username
            </label>
            <input type="text" disabled value="<?= e($_SESSION['admin_username']) ?>"
                   class="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
        </div>

        <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password Saat Ini *
            </label>
            <input type="password" name="lama" required placeholder="Masukkan password lama..."
                   class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
        </div>

        <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password Baru (Min. 6 Karakter) *
            </label>
            <input type="password" name="baru" required placeholder="Masukkan password baru..." minlength="6"
                   class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
        </div>

        <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ulangi Password Baru *
            </label>
            <input type="password" name="konfirmasi" required placeholder="Ketik ulang password baru..." minlength="6"
                   class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
        </div>

        <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#c9a227] hover:brightness-105 text-[#0d2818] shadow-sm transition flex items-center gap-2 cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                Perbarui Kata Sandi
            </button>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/inc/footer.php'; ?>
