import { randomBytes, scryptSync } from 'node:crypto'

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const PENGATURAN_AWAL = [
  { kunci: 'hero_deskripsi', nilai: 'Kami hadir untuk menegakkan hukum, melindungi kepentingan masyarakat, dan mewujudkan keadilan di Kabupaten Purbalingga.' },
  { kunci: 'hero_kutipan', nilai: 'Kejaksaan hadir untuk masyarakat, demi hukum yang berkeadilan.' },
  { kunci: 'tentang_deskripsi', nilai: 'Kejaksaan Negeri Purbalingga adalah lembaga penegak hukum yang berkomitmen menegakkan supremasi hukum, melindungi kepentingan umum, dan memberikan pelayanan hukum yang profesional, transparan, dan berkeadilan pada kepentingan masyarakat.' },
  { kunci: 'cta_judul', nilai: 'Dapatkan Layanan Hukum\ndan Informasi Terpercaya' },
  { kunci: 'cta_deskripsi', nilai: 'Hubungi kami sekarang untuk mendapatkan informasi dan layanan yang kamu butuhkan.' },
  { kunci: 'alamat', nilai: 'Jalan Jendral Sudirman No. 93A,\nPurbalingga, Jawa Tengah 53311' },
]

const BERITA_AWAL = [
  {
    judul: 'Upacara Peringatan Hari Lahir Kejaksaan Republik Indonesia',
    ringkasan: 'Kejaksaan Negeri Purbalingga melaksanakan upacara peringatan hari lahir Kejaksaan RI dengan khidmat dan penuh semangat.',
    gambar: '/upacara.jpg',
    tanggal: '2026-09-12',
  },
  {
    judul: 'Sosialisasi Hukum di Sekolah',
    ringkasan: 'Kejaksaan Negeri Purbalingga memberikan edukasi hukum kepada pelajar sebagai upaya pencegahan pelanggaran hukum sejak dini.',
    gambar: '/sekolah.jpg',
    tanggal: '2026-09-08',
  },
  {
    judul: 'Penguatan Zona Integritas',
    ringkasan: 'Kejaksaan Negeri Purbalingga berkomitmen mewujudkan Wilayah Birokrasi Bersih dan Melayani (WBBM).',
    gambar: '/gedung.jpg',
    tanggal: '2026-09-01',
  },
]

const LAYANAN_AWAL = [
  {
    judul: 'Pelayanan Antar Barang Bukti (LANTINGBARLING)',
    deskripsi: 'Layanan antar barang bukti yang telah berkekuatan hukum tetap kepada pemiliknya secara gratis.',
    gambar: '/barang-bukti.jpg',
  },
  {
    judul: 'Halo JPN (Jaksa Pengacara Negara)',
    deskripsi: 'Layanan konsultasi hukum dan bantuan hukum oleh Jaksa Pengacara Negara untuk masyarakat.',
    gambar: '/konsultasi.jpg',
  },
  {
    judul: 'SIBETA (Surat Izin Besuk Tahanan)',
    deskripsi: 'Layanan permohonan izin besuk tahanan secara mudah, cepat, dan transparan.',
    gambar: '/besuk.jpg',
  },
]

const TESTIMONI_AWAL = [
  {
    nama: 'Andi Prabowo',
    peran: 'Masyarakat',
    kutipan: 'Layanan yang diberikan sangat profesional dan membantu, saya memahami hak-hak saya dalam proses hukum yang rumit.',
  },
]

export async function up(knex) {
  // Seed Pengaturan
  const cPengaturan = await knex('pengaturan').count('kunci as c').first()
  if (Number(cPengaturan.c) === 0) {
    await knex('pengaturan').insert(PENGATURAN_AWAL)
  }

  // Seed Berita
  const cBerita = await knex('berita').count('id as c').first()
  if (Number(cBerita.c) === 0) {
    await knex('berita').insert(BERITA_AWAL)
  }

  // Seed Layanan
  const cLayanan = await knex('layanan').count('id as c').first()
  if (Number(cLayanan.c) === 0) {
    await knex('layanan').insert(LAYANAN_AWAL)
  }

  // Seed Testimoni
  const cTestimoni = await knex('testimoni').count('id as c').first()
  if (Number(cTestimoni.c) === 0) {
    await knex('testimoni').insert(TESTIMONI_AWAL)
  }

  // Seed Admin Akun Default (jika belum ada)
  const cAdmin = await knex('admin').count('id as c').first()
  if (Number(cAdmin.c) === 0) {
    await knex('admin').insert({
      username: 'admin',
      password_hash: hashPassword('admin123'),
    })
  }
}

export async function down(knex) {
  // Rollback seeder tidak menghapus data jika sudah ada transaksi nyata,
  // namun dapat mengosongkan jika diperlukan
}
