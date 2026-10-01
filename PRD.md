# PRD — Website Kejaksaan Negeri Purbalingga

**Versi dokumen:** 1.1
**Tanggal:** 1 Oktober 2026
**Status:** v1.1.0 selesai — landing page + CMS (backend API + panel admin)

---

## 1. Latar Belakang & Tujuan

Kejaksaan Negeri Purbalingga membutuhkan kehadiran digital resmi yang menjadi pintu utama
informasi dan layanan hukum bagi masyarakat Kabupaten Purbalingga. Website ini bertujuan:

1. Menyajikan profil dan informasi resmi Kejaksaan Negeri Purbalingga secara terbuka.
2. Memudahkan masyarakat mengakses layanan (LANTINGBARLING, Halo JPN, SIBETA, pengaduan, edukasi hukum, informasi publik).
3. Mempublikasikan berita & kegiatan sebagai bentuk transparansi dan akuntabilitas.
4. Menegaskan nilai institusi (Tri Krama Adhyaksa) dan membangun kepercayaan publik.
5. **(v1.1)** Memberi staf/admin kemampuan memperbarui konten website tanpa coding, melalui panel admin.

## 2. Target Pengguna

| Pengguna | Kebutuhan |
|----------|-----------|
| Masyarakat umum Purbalingga | Info layanan, cara mengurus izin besuk, pengaduan |
| Pencari keadilan / pihak berperkara | Konsultasi JPN, pengambilan barang bukti |
| Pelajar & akademisi | Edukasi hukum, materi sosialisasi |
| Jurnalis / publik | Berita, kegiatan, dan informasi resmi |
| **Admin/staf humas (v1.1)** | Kelola berita, layanan, testimoni, dan teks website via panel admin |

## 3. Ruang Lingkup (v1.1)

### 3.1 Halaman utama `/` (publik)

10 section seperti v1.0, dengan konten dinamis dari API:

| # | Section | Sumber data (v1.1) |
|---|---------|--------------------|
| 1 | Navbar | Statis |
| 2 | Hero | `pengaturan.hero_deskripsi`, `pengaturan.hero_kutipan` |
| 3 | Layanan Cepat | Statis (6 pintu layanan) |
| 4 | Tentang Kami | `pengaturan.tentang_deskripsi` |
| 5 | Layanan Kami | Tabel `layanan` (CRUD) |
| 6 | Berita & Kegiatan | Tabel `berita` (CRUD, 3 terbaru) |
| 7 | Tri Krama Adhyaksa | Statis |
| 8 | Testimoni | Tabel `testimoni` (CRUD, tampil 1 pertama) |
| 9 | CTA | `pengaturan.cta_judul`, `pengaturan.cta_deskripsi` |
| 10 | Footer | `pengaturan.alamat` + tautan "Admin" |

Jika backend tidak berjalan, halaman memakai data fallback statis sehingga tetap tampil.

### 3.2 Panel admin `/admin`

- Login username + password (token sesi, tersimpan di localStorage)
- Tab **Berita**: CRUD judul, tanggal, gambar, ringkasan
- Tab **Layanan**: CRUD judul, gambar, deskripsi
- Tab **Testimoni**: CRUD nama, peran, kutipan
- Tab **Pengaturan**: edit 6 teks website (hero, tentang, CTA, alamat)
- Tab **Akun**: ganti password (min. 6 karakter, verifikasi password lama)

### 3.3 Di Luar Ruang Lingkup v1.1

- Upload gambar via admin (saat ini pilih dari file yang sudah ada di `public/`)
- Halaman detail artikel/berita dan arsip berita
- Multi-admin / peran (baru 1 akun admin)
- Multi-bahasa, mode gelap

## 4. Kebutuhan Fungsional

| ID | Kebutuhan | Status |
|----|-----------|--------|
| F-01 | Navigasi antar section via menu | ✅ Anchor menu (placeholder `#`) |
| F-02 | Menampilkan 6 layanan cepat dengan ikon | ✅ |
| F-03 | Menampilkan profil + pemutar video | ✅ (tombol play, video belum disambungkan) |
| F-04 | Menampilkan daftar layanan unggulan | ✅ dinamis dari API |
| F-05 | Menampilkan berita & kegiatan terbaru | ✅ dinamis dari API |
| F-06 | Menampilkan nilai Tri Krama Adhyaksa | ✅ |
| F-07 | Menampilkan testimoni masyarakat | ✅ dinamis dari API |
| F-08 | CTA kontak | ✅ (tombol placeholder) |
| F-09 | Informasi alamat & kontak di footer | ✅ dinamis dari pengaturan |
| F-10 | **(v1.1)** Login admin ber-token | ✅ |
| F-11 | **(v1.1)** CRUD berita/layanan/testimoni | ✅ |
| F-12 | **(v1.1)** Edit teks website via pengaturan | ✅ |
| F-13 | **(v1.1)** Ganti password admin | ✅ |
| F-14 | **(v1.1)** Perubahan admin langsung tampil di halaman utama | ✅ (fetch `/api/konten` saat load) |

## 5. Kebutuhan Non-Fungsional

| ID | Kebutuhan | Status |
|----|-----------|--------|
| NF-01 | Responsif: desktop, tablet, ponsel | ✅ (grid Tailwind responsif; panel admin mobile-friendly) |
| NF-02 | Waktu muat cepat: aset gambar lokal & terkompresi | ✅ (8 JPG lokal, ~1,4 MB total) |
| NF-03 | Aksesibilitas dasar: alt text, label tombol ikon | ✅ |
| NF-04 | Konsistensi visual: palet hijau tua + emas + krem | ✅ (design token di `index.css`) |
| NF-05 | Build production dapat direproduksi (`npm run build`) | ✅ terverifikasi |
| NF-06 | **(v1.1)** Endpoint admin wajib autentikasi | ✅ (401 tanpa token — terverifikasi) |
| NF-07 | **(v1.1)** Password tidak disimpan plain-text | ✅ (scrypt hash) |
| NF-08 | **(v1.1)** Halaman utama tetap tampil jika backend mati | ✅ (fallback `KONTEN_DEFAULT`) |

## 6. Desain & Identitas Visual

- **Warna primer:** hijau tua `#0d2818` (header, hero, section berita, CTA, footer)
- **Warna aksen:** emas `#c9a227` / `#e3b94e` (tombol, badge tanggal, ikon, garis pemisah)
- **Latar terang:** krem `#faf7ef`
- **Panel admin:** latar abu terang, header hijau tua, tombol emas — konsisten dengan identitas
- **Tipografi:** sans-serif sistem (Segoe UI / system-ui)
- **Gaya:** kartu rounded-2xl dengan shadow, badge tanggal emas pada kartu berita

## 7. Teknologi

- Frontend: React 19 + React Router 7 + Vite 6 + Tailwind CSS v4 (`@tailwindcss/vite`)
- Backend: Express 4 + better-sqlite3 + CORS (ES modules, `server/`)
- Database: SQLite file `server/data/kejari.db` (WAL), seed otomatis saat pertama jalan
- Auth: token acak 256-bit di tabel `sesi`, password di-hash scrypt
- Tanpa UI framework tambahan; ikon berupa inline SVG; gambar lokal di `public/`

## 8. Kriteria Penerimaan v1.1

- [x] Seluruh 10 section tampil sesuai urutan mockup, konten dinamis dari API
- [x] `npm run build` sukses tanpa error
- [x] Login dengan `admin/admin123` berhasil; password salah ditolak (401)
- [x] Tambah/edit/hapus berita, layanan, testimoni via panel admin berhasil dan langsung tampil di `/`
- [x] Edit pengaturan teks via panel admin langsung tampil di `/`
- [x] Endpoint `/api/admin/*` tanpa token mengembalikan 401
- [x] Halaman `/` tetap tampil (data fallback) saat backend dimatikan

## 9. Rencana Pengembangan (Roadmap)

1. **v1.2** — Upload gambar via panel admin; halaman detail + arsip berita; video profil tersambung
2. **v1.3** — Multi-admin dengan peran (editor vs superadmin); log aktivitas
3. **v2.0** — Formulir layanan online (pengaduan, permohonan SIBETA); portal layanan terpadu

## 10. Risiko & Catatan

- Foto saat ini adalah foto stok generik sebagai placeholder — perlu diganti foto resmi institusi sebelum publikasi.
- Teks konten (profil, berita, testimoni) adalah draf — perlu kurasi humas sebelum rilis publik.
- Kredensial default `admin/admin123` **wajib diganti** setelah login pertama (diingatkan di halaman login & README).
- Tombol/link publik masih placeholder (`#`) hingga halaman tujuan tersedia.
- Database berupa file lokal — jadwalkan backup berkala; untuk production pertimbangkan HTTPS + reverse proxy `/api`.
