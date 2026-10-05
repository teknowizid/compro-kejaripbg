<?php
require_once __DIR__ . '/koneksi.php';

// Ambil data publik dari database
$pengaturan = get_pengaturan($pdo);

// Ambil berita terbaru (maksimal 3 untuk landing page)
$stmt_berita = $pdo->query("SELECT * FROM berita ORDER BY tanggal DESC, id DESC LIMIT 3");
$daftar_berita = $stmt_berita->fetchAll();

// Ambil layanan publik
$stmt_layanan = $pdo->query("SELECT * FROM layanan ORDER BY id ASC");
$daftar_layanan = $stmt_layanan->fetchAll();

// Ambil testimoni
$stmt_testimoni = $pdo->query("SELECT * FROM testimoni ORDER BY id ASC LIMIT 1");
$testimoni = $stmt_testimoni->fetch();

$EMAS = '#c9a227';
$KEJARI_DARK = '#0d2818';
?>
<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kejaksaan Negeri Purbalingga — Website Resmi</title>
    <meta name="description" content="Website profil resmi Kejaksaan Negeri Purbalingga. Memberikan pelayanan hukum yang profesional, berintegritas, dan melayani masyarakat.">
    
    <!-- Tailwind CSS (CDN + Local Stylesheet) -->
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        emas: '#c9a227',
                        kejari: '#0d2818',
                        'kejari-dark': '#081b10',
                        'kejari-light': '#14532d',
                    }
                }
            }
        }
    </script>
    <style>
        .gold-gradient {
            background: linear-gradient(135deg, #c9a227, #e3b94e);
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col font-sans selection:bg-[#c9a227] selection:text-[#0d2818]">

    <!-- ================= NAVBAR ================= -->
    <header class="bg-[#0d2818] text-white sticky top-0 z-50 shadow-lg border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <a href="index.php" class="flex items-center gap-3 group">
                <div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[#0d2818] text-sm gold-gradient shadow-md group-hover:scale-105 transition">
                    KN
                </div>
                <div class="leading-tight">
                    <p class="font-bold text-[15px] tracking-tight">Kejaksaan Negeri</p>
                    <p class="text-[13px] font-medium" style="color: <?= $EMAS ?>;">Purbalingga</p>
                </div>
            </a>
            
            <nav class="hidden lg:flex items-center gap-7 text-[14px]">
                <a href="#beranda" class="font-semibold transition" style="color: <?= $EMAS ?>;">Beranda</a>
                <a href="#tentang" class="text-white/80 hover:text-white transition">Tentang</a>
                <a href="#layanan" class="text-white/80 hover:text-white transition">Layanan</a>
                <a href="#berita" class="text-white/80 hover:text-white transition">Informasi Publik</a>
                <a href="#berita" class="text-white/80 hover:text-white transition">Berita</a>
                <a href="#kontak" class="text-white/80 hover:text-white transition">Kontak</a>
            </nav>

            <div class="flex items-center gap-4">
                <a href="#kontak" class="hidden sm:inline-block text-[#0d2818] font-bold text-sm px-5 py-2.5 rounded-full gold-gradient shadow-md hover:brightness-105 transition">
                    Hubungi Kami
                </a>
            </div>
        </div>
    </header>

    <!-- ================= HERO SECTION ================= -->
    <section id="beranda" class="bg-[#0d2818] text-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 pt-14 pb-28 grid lg:grid-cols-2 gap-10 items-center">
            <div>
                <p class="tracking-[0.25em] text-xs font-bold mb-4" style="color: <?= $EMAS ?>;">SELAMAT DATANG DI</p>
                <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
                    Kejaksaan Negeri<br />Purbalingga
                </h1>
                <p class="text-white/70 max-w-md mb-8 leading-relaxed text-sm md:text-base">
                    <?= e($pengaturan['hero_deskripsi']) ?>
                </p>
                <div class="flex flex-wrap gap-4 mb-10">
                    <a href="#layanan" class="text-[#0d2818] font-bold px-6 py-3 rounded-full text-sm gold-gradient shadow-lg hover:brightness-105 transition">
                        Layanan Kami →
                    </a>
                    <a href="#tentang" class="border border-white/40 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/10 transition">
                        Tentang Kami
                    </a>
                </div>
                <div class="flex flex-wrap gap-8 text-sm">
                    <?php 
                    $pilars = ['Profesional', 'Berintegritas', 'Melayani'];
                    foreach ($pilars as $pilar): 
                    ?>
                    <span class="flex items-center gap-2 text-white/90 font-medium">
                        <span style="color: <?= $EMAS ?>;">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                        <?= $pilar ?>
                    </span>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <div class="relative">
                <img src="<?= get_gambar_url('assets/images/hero.jpg') ?>" alt="Kegiatan Kejaksaan Negeri Purbalingga"
                     class="rounded-2xl w-full h-[380px] object-cover shadow-2xl border border-white/10" />
                <div class="absolute -bottom-6 -left-6 bg-white text-gray-800 rounded-xl shadow-xl p-5 max-w-[280px] border border-gray-100 hidden sm:block">
                    <p class="text-3xl leading-none mb-2 font-serif font-bold" style="color: <?= $EMAS ?>;">“</p>
                    <p class="text-sm italic text-gray-700 leading-snug"><?= e($pengaturan['hero_kutipan']) ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- ================= LAYANAN CEPAT (6 PINTU) ================= -->
    <div class="max-w-7xl mx-auto px-6 -mt-14 relative z-10">
        <div class="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-gray-100 overflow-hidden border border-slate-100">
            <?php
            $quick_services = [
                ['Pelayanan Antar Barang Bukti', '(LANTINGBARLING)', 'M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10M4 7v10l8 4'],
                ['Halo JPN', '(Jaksa Pengacara Negara)', 'M8 10h8m-8 4h6m4-9H6a2 2 0 00-2 2v9a2 2 0 002 2h9l5 3V7a2 2 0 00-2-2z'],
                ['SIBETA', '(Surat Izin Besuk Tahanan)', 'M9 12h6m-6 4h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z'],
                ['Pengaduan Masyarakat', '', 'M3 11l14-5v12L3 13v-2zM7 13v5a2 2 0 004 0v-3.5M17 8a3 3 0 010 6'],
                ['Edukasi Hukum', '', 'M12 6.25v11.5m0-11.5C10.83 6.25 8.5 5.5 5 5.5v11.5c3.5 0 5.83.75 7 1.25m0-12c1.17-.5 3.5-1.25 7-1.25v11.5c-3.5 0-5.83.75-7 1.25'],
                ['Informasi Publik', '', 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z'],
            ];
            foreach ($quick_services as [$judul, $sub, $svgPath]):
            ?>
            <a href="#layanan" class="p-6 flex flex-col items-center text-center gap-3 hover:bg-[#faf7ef] transition group">
                <span class="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition"
                      style="background: linear-gradient(135deg, #14532d, #0d2818);">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="<?= $svgPath ?>" />
                    </svg>
                </span>
                <span>
                    <p class="font-bold text-[13px] leading-snug text-slate-800"><?= $judul ?></p>
                    <?php if ($sub): ?>
                        <p class="text-[11px] text-gray-500 mt-0.5"><?= $sub ?></p>
                    <?php endif; ?>
                </span>
            </a>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- ================= TENTANG KAMI ================= -->
    <section id="tentang" class="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div class="relative">
            <img src="<?= get_gambar_url('assets/images/gedung.jpg') ?>" alt="Gedung Kejaksaan Negeri Purbalingga"
                 class="rounded-2xl w-full h-[380px] object-cover shadow-xl border border-gray-100" />
            <div class="absolute bottom-5 left-5 bg-[#0d2818]/90 backdrop-blur-sm text-white rounded-xl px-5 py-3 border border-white/10">
                <p class="font-bold text-sm">Profil Kejaksaan Negeri Purbalingga</p>
                <p class="text-xs text-white/70">Integritas & Pelayanan Masyarakat</p>
            </div>
        </div>
        <div>
            <p class="tracking-[0.25em] text-xs font-bold mb-3" style="color: <?= $EMAS ?>;">TENTANG KAMI</p>
            <h2 class="text-3xl font-extrabold text-slate-900 mb-5 leading-tight">
                Kejaksaan Negeri<br />Purbalingga
            </h2>
            <p class="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                <?= e($pengaturan['tentang_deskripsi']) ?>
            </p>
            <div class="grid sm:grid-cols-3 gap-4 mb-8">
                <?php
                $prinsip = [
                    ['Profesional', 'Penegakan hukum'],
                    ['Transparan', 'Pelayanan publik'],
                    ['Akuntabel', 'Tindakan nyata']
                ];
                foreach ($prinsip as [$t, $s]):
                ?>
                <div class="flex items-start gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                    <span style="color: <?= $EMAS ?>;" class="mt-0.5">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </span>
                    <div>
                        <p class="font-bold text-sm text-slate-800"><?= $t ?></p>
                        <p class="text-xs text-gray-500"><?= $s ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <a href="#layanan" class="inline-flex items-center gap-2 font-bold text-sm hover:underline" style="color: <?= $EMAS ?>;">
                Selengkapnya 
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
        </div>
    </section>

    <!-- ================= LAYANAN KAMI ================= -->
    <section id="layanan" class="max-w-7xl mx-auto px-6 pb-20">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
                <p class="tracking-[0.25em] text-xs font-bold mb-2" style="color: <?= $EMAS ?>;">PELAYANAN PUBLIK</p>
                <h2 class="text-3xl font-extrabold text-slate-900">Layanan Kami</h2>
                <p class="text-gray-500 text-sm mt-1 max-w-md">Berbagai layanan hukum dan informasi terpadu yang dapat diakses oleh masyarakat.</p>
            </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
            <?php foreach ($daftar_layanan as $l): ?>
            <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col">
                <img src="<?= get_gambar_url($l['gambar']) ?>" alt="<?= e($l['judul']) ?>" class="w-full h-48 object-cover" />
                <div class="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-slate-900 text-lg mb-2"><?= e($l['judul']) ?></h3>
                        <p class="text-sm text-gray-600 mb-4 leading-relaxed"><?= e($l['deskripsi']) ?></p>
                    </div>
                    <a href="#kontak" class="inline-flex items-center gap-2 text-sm font-bold mt-auto" style="color: <?= $EMAS ?>;">
                        Akses Layanan
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- ================= BERITA & KEGIATAN ================= -->
    <section id="berita" class="bg-[#0d2818] text-white py-20">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                    <p class="tracking-[0.25em] text-xs font-bold mb-3" style="color: <?= $EMAS ?>;">INFORMASI TERKINI</p>
                    <h2 class="text-3xl font-extrabold">Berita & Kegiatan</h2>
                    <p class="text-white/70 text-sm mt-2 max-w-lg">Ikuti perkembangan terbaru seputar kegiatan, program kerja, dan informasi penting Kejaksaan Negeri Purbalingga.</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <?php foreach ($daftar_berita as $b): ?>
                <article class="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition flex flex-col">
                    <div class="relative">
                        <img src="<?= get_gambar_url($b['gambar']) ?>" alt="<?= e($b['judul']) ?>" class="w-full h-48 object-cover" />
                        <div class="absolute top-4 left-4 text-[#0d2818] rounded-xl px-3 py-1.5 text-center font-bold gold-gradient shadow-md">
                            <p class="text-xl leading-none font-black"><?= hari_dari_tanggal($b['tanggal']) ?></p>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <p class="text-xs text-white/50 mb-2 font-medium"><?= tanggal_indo($b['tanggal']) ?></p>
                            <h3 class="font-bold text-white text-base mb-2 line-clamp-2"><?= e($b['judul']) ?></h3>
                            <p class="text-sm text-white/70 mb-4 line-clamp-3 leading-relaxed"><?= e($b['ringkasan']) ?></p>
                        </div>
                        <a href="#berita" class="inline-flex items-center gap-2 text-sm font-semibold mt-auto" style="color: <?= $EMAS ?>;">
                            Baca Selengkapnya 
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- ================= TRI KRAMA ADHYAKSA ================= -->
    <section class="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 class="text-2xl font-black tracking-wider text-slate-900 mb-2">TRI KRAMA ADHYAKSA</h2>
        <p class="text-gray-500 text-sm mb-12 max-w-xl mx-auto">Nilai luhur yang menjadi pedoman hidup dan pengabdian setiap insan Adhyaksa dalam menjalankan amanah penegakan hukum.</p>
        
        <div class="grid md:grid-cols-3 gap-8">
            <?php
            $tri_krama = [
                ['SATYA', 'Kesetiaan yang bersumber pada rasa jujur, baik terhadap Tuhan Yang Maha Esa, diri pribadi dan sesama manusia.'],
                ['ADHI', 'Kesempurnaan dalam bertugas dan berjiwa Pancasila serta bertanggung jawab terhadap Tuhan Yang Maha Esa, keluarga dan sesama manusia.'],
                ['WICAKSANA', 'Bijaksana dalam tutur kata dan tingkah laku, khususnya dalam menerapkan kewenangan dan kekuasaannya.']
            ];
            foreach ($tri_krama as [$t, $d]):
            ?>
            <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-lg"
                     style="background: #f3ead0; color: #8a6d1c;">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 class="font-extrabold tracking-widest mb-3 text-base" style="color: #8a6d1c;"><?= $t ?></h3>
                <p class="text-sm text-gray-600 leading-relaxed"><?= $d ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- ================= TESTIMONI ================= -->
    <?php if ($testimoni): ?>
    <section class="relative py-20 text-white text-center overflow-hidden">
        <img src="<?= get_gambar_url('assets/images/hukum.jpg') ?>" alt="" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-[#0d2818]/85 backdrop-blur-[2px]"></div>
        <div class="relative max-w-3xl mx-auto px-6">
            <p class="text-5xl mb-4 font-serif font-bold leading-none" style="color: <?= $EMAS ?>;">“</p>
            <p class="text-xl md:text-2xl italic mb-6 font-light leading-relaxed">
                <?= e($testimoni['kutipan']) ?>
            </p>
            <div class="flex items-center justify-center gap-3">
                <div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-white border border-white/30">
                    <?= strtoupper(substr(trim($testimoni['nama'] ?: '?'), 0, 1)) ?>
                </div>
                <div class="text-left">
                    <p class="font-bold text-sm"><?= e($testimoni['nama']) ?></p>
                    <p class="text-xs text-white/70"><?= e($testimoni['peran']) ?></p>
                </div>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- ================= CTA KONTAK ================= -->
    <section id="kontak" class="bg-[#0d2818] text-white border-t border-white/5">
        <div class="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
                <h2 class="text-3xl font-extrabold mb-3 whitespace-pre-line leading-tight">
                    <?= e($pengaturan['cta_judul']) ?>
                </h2>
                <p class="text-white/70 text-sm max-w-xl leading-relaxed">
                    <?= e($pengaturan['cta_deskripsi']) ?>
                </p>
            </div>
            <a href="mailto:kejari.purbalingga@kejaksaan.go.id" class="text-[#0d2818] font-bold px-8 py-3.5 rounded-full shrink-0 gold-gradient shadow-xl hover:brightness-105 transition">
                Hubungi Kami →
            </a>
        </div>
    </section>

    <!-- ================= FOOTER ================= -->
    <footer class="bg-[#081b10] text-white">
        <div class="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[#0d2818] text-sm gold-gradient shadow-md">
                        KN
                    </div>
                    <div class="leading-tight">
                        <p class="font-bold text-[15px]">Kejaksaan Negeri</p>
                        <p class="text-[13px] font-medium" style="color: <?= $EMAS ?>;">Purbalingga</p>
                    </div>
                </div>
                <p class="text-sm text-white/60 whitespace-pre-line leading-relaxed">
                    <?= e($pengaturan['alamat']) ?>
                </p>
            </div>
            
            <div>
                <h4 class="font-bold mb-4 text-sm tracking-wider uppercase text-white/90">Navigasi</h4>
                <ul class="space-y-2.5 text-sm text-white/60">
                    <li><a href="#beranda" class="hover:text-white transition">Beranda</a></li>
                    <li><a href="#tentang" class="hover:text-white transition">Tentang Kami</a></li>
                    <li><a href="#layanan" class="hover:text-white transition">Layanan</a></li>
                    <li><a href="#berita" class="hover:text-white transition">Informasi Publik</a></li>
                    <li><a href="#berita" class="hover:text-white transition">Berita</a></li>
                    <li><a href="#kontak" class="hover:text-white transition">Kontak</a></li>
                </ul>
            </div>
            
            <div>
                <h4 class="font-bold mb-4 text-sm tracking-wider uppercase text-white/90">Layanan Populer</h4>
                <ul class="space-y-2.5 text-sm text-white/60">
                    <li><a href="#layanan" class="hover:text-white transition">LANTINGBARLING</a></li>
                    <li><a href="#layanan" class="hover:text-white transition">Halo JPN</a></li>
                    <li><a href="#layanan" class="hover:text-white transition">SIBETA</a></li>
                    <li><a href="#layanan" class="hover:text-white transition">Pengaduan Masyarakat</a></li>
                </ul>
            </div>
            
            <div>
                <h4 class="font-bold mb-4 text-sm tracking-wider uppercase text-white/90">Akses CMS</h4>
                <p class="text-xs text-white/60 mb-4 leading-relaxed">Akses dashboard pengelola konten untuk staf dan administrator resmi.</p>
                <a href="admin/login.php" class="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    Panel Admin CMS
                </a>
            </div>
        </div>
        
        <div class="border-t border-white/10">
            <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
                <p>© <?= date('Y') ?> Kejaksaan Negeri Purbalingga. Hak Cipta Dilindungi.</p>
                <div class="flex items-center gap-4">
                    <a href="admin/login.php" class="hover:text-white transition">Login Admin</a>
                    <span>•</span>
                    <span>Sitemap</span>
                    <span>•</span>
                    <span>Kebijakan Privasi</span>
                </div>
            </div>
        </div>
    </footer>

</body>
</html>
