<?php
require_once __DIR__ . '/../koneksi.php';

// Jika sudah login, langsung ke dashboard
if (isset($_SESSION['admin_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string)($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        $error = 'Username dan password wajib diisi!';
    } else {
        $stmt = $pdo->prepare("SELECT * FROM admin WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        $login_berhasil = false;

        if ($user) {
            // Cek password hash bcrypt
            if (password_verify($password, $user['password_hash'])) {
                $login_berhasil = true;
            } 
            // Fallback backward-compat jika password masih plain 'admin123'
            elseif ($user['password_hash'] === 'admin123' && $password === 'admin123') {
                $login_berhasil = true;
                // Otomatis upgrade ke bcrypt aman!
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $up = $pdo->prepare("UPDATE admin SET password_hash = ? WHERE id = ?");
                $up->execute([$newHash, $user['id']]);
            }
        }

        if ($login_berhasil) {
            // Regenerate session ID untuk mencegah session fixation attack
            session_regenerate_id(true);
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            
            set_flash('success', 'Selamat datang kembali, ' . e($user['username']) . '!');
            header('Location: index.php');
            exit;
        } else {
            $error = 'Username atau password salah.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin CMS — Kejaksaan Negeri Purbalingga</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        emas: '#c9a227',
                        kejari: '#0d2818',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4 selection:bg-[#c9a227] selection:text-[#0d2818]">

    <div class="w-full max-w-md">
        <!-- Logo & Header Card -->
        <div class="text-center mb-8">
            <div class="inline-flex w-16 h-16 rounded-full items-center justify-center font-bold text-[#0d2818] text-xl shadow-xl mb-4"
                 style="background: linear-gradient(135deg, #c9a227, #e3b94e);">
                KN
            </div>
            <h1 class="text-2xl font-bold text-white tracking-tight">Panel Admin CMS</h1>
            <p class="text-sm text-slate-400 mt-1">Kejaksaan Negeri Purbalingga</p>
        </div>

        <!-- Form Card -->
        <div class="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-slate-700/80">
            <?php if (!empty($error)): ?>
                <div class="mb-6 p-4 rounded-xl bg-red-900/60 border border-red-700/80 text-red-200 text-sm flex items-center gap-3">
                    <svg class="w-5 h-5 shrink-0 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span><?= e($error) ?></span>
                </div>
            <?php endif; ?>

            <form method="POST" action="login.php" class="space-y-5">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Username</label>
                    <div class="relative">
                        <input type="text" name="username" required autofocus placeholder="admin"
                               value="<?= e($_POST['username'] ?? '') ?>"
                               class="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a227] focus:border-transparent transition" />
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Password</label>
                    <input type="password" name="password" required placeholder="••••••••"
                           class="w-full bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a227] focus:border-transparent transition" />
                </div>

                <button type="submit"
                        class="w-full font-bold text-[#0d2818] py-3.5 rounded-xl shadow-lg hover:brightness-105 transition flex items-center justify-center gap-2 mt-6 cursor-pointer"
                        style="background: linear-gradient(135deg, #c9a227, #e3b94e);">
                    <span>Masuk ke Dashboard</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </form>

            <div class="mt-6 pt-6 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <a href="../index.php" class="hover:text-white transition flex items-center gap-1">
                    ← Kembali ke Website
                </a>
                <span>Default: admin / admin123</span>
            </div>
        </div>
    </div>

</body>
</html>
