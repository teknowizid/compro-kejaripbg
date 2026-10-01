import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchKonten, KONTEN_DEFAULT, hariDariTanggal } from '../lib/api.js'

const EMAS = '#c9a227'

function Ikon({ d, className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

const ikonBox = 'M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10M4 7v10l8 4'
const ikonChat = 'M8 10h8m-8 4h6m4-9H6a2 2 0 00-2 2v9a2 2 0 002 2h9l5 3V7a2 2 0 00-2-2z'
const ikonSurat = 'M9 12h6m-6 4h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z'
const ikonMegaphone = 'M3 11l14-5v12L3 13v-2zM7 13v5a2 2 0 004 0v-3.5M17 8a3 3 0 010 6'
const ikonBuku = 'M12 6.25v11.5m0-11.5C10.83 6.25 8.5 5.5 5 5.5v11.5c3.5 0 5.83.75 7 1.25m0-12c1.17-.5 3.5-1.25 7-1.25v11.5c-3.5 0-5.83.75-7 1.25'
const ikonGlobe = 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z'
const ikonSearch = 'M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z'
const ikonCheck = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
const ikonPanah = 'M17 8l4 4m0 0l-4 4m4-4H3'

function Navbar() {
  const menu = ['Beranda', 'Tentang', 'Layanan', 'Informasi Publik', 'Berita', 'Kontak']
  return (
    <header className="bg-[#0d2818] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[#0d2818] text-sm"
               style={{ background: `linear-gradient(135deg, ${EMAS}, #e3b94e)` }}>
            KN
          </div>
          <div className="leading-tight">
            <p className="font-bold text-[15px]">Kejaksaan Negeri</p>
            <p className="text-[13px]" style={{ color: EMAS }}>Purbalingga</p>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-7 text-[14px]">
          {menu.map((m, i) => (
            <a key={m} href="#" className={i === 0 ? 'font-semibold' : 'text-white/80 hover:text-white'}
               style={i === 0 ? { color: EMAS } : {}}>{m}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-white/80 hover:text-white"><Ikon d={ikonSearch} className="w-5 h-5" /></button>
          <a href="#kontak" className="hidden sm:inline-block text-[#0d2818] font-semibold text-sm px-5 py-2.5 rounded-full"
             style={{ background: `linear-gradient(135deg, ${EMAS}, #e3b94e)` }}>Hubungi Kami</a>
        </div>
      </div>
    </header>
  )
}

function Hero({ pengaturan }) {
  return (
    <section className="bg-[#0d2818] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-28 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="tracking-[0.25em] text-xs mb-4" style={{ color: EMAS }}>SELAMAT DATANG DI</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Kejaksaan Negeri<br />Purbalingga
          </h1>
          <p className="text-white/70 max-w-md mb-8">{pengaturan.hero_deskripsi}</p>
          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#layanan" className="text-[#0d2818] font-semibold px-6 py-3 rounded-full text-sm"
               style={{ background: `linear-gradient(135deg, ${EMAS}, #e3b94e)` }}>Layanan Kami →</a>
            <a href="#tentang" className="border border-white/40 px-6 py-3 rounded-full text-sm hover:bg-white/10">Tentang Kami</a>
          </div>
          <div className="flex gap-8 text-sm">
            {[['Profesional', ikonCheck], ['Berintegritas', ikonCheck], ['Melayani', ikonCheck]].map(([t, d]) => (
              <span key={t} className="flex items-center gap-2 text-white/80">
                <span style={{ color: EMAS }}><Ikon d={d} className="w-5 h-5" /></span>{t}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <img src="/hero.jpg" alt="Kegiatan Kejaksaan Negeri Purbalingga"
               className="rounded-2xl w-full h-[380px] object-cover shadow-2xl" />
          <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 rounded-xl shadow-xl p-5 max-w-[280px]">
            <p className="text-3xl leading-none mb-2" style={{ color: EMAS }}>“</p>
            <p className="text-sm italic">{pengaturan.hero_kutipan}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function LayananCepat() {
  const items = [
    ['Pelayanan Antar Barang Bukti', '(LANTINGBARLING)', ikonBox],
    ['Halo JPN', '(Jaksa Pengacara Negara)', ikonChat],
    ['SIBETA', '(Surat Izin Besuk Tahanan)', ikonSurat],
    ['Pengaduan Masyarakat', '', ikonMegaphone],
    ['Edukasi Hukum', '', ikonBuku],
    ['Informasi Publik', '', ikonGlobe],
  ]
  return (
    <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-gray-100 overflow-hidden">
        {items.map(([judul, sub, d]) => (
          <a key={judul} href="#layanan" className="p-6 flex flex-col items-center text-center gap-3 hover:bg-[#faf7ef] transition">
            <span className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ background: `linear-gradient(135deg, #14532d, #0d2818)` }}>
              <Ikon d={d} />
            </span>
            <span>
              <p className="font-semibold text-[13px] leading-snug">{judul}</p>
              {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

function Tentang({ pengaturan }) {
  return (
    <section id="tentang" className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div className="relative">
        <img src="/gedung.jpg" alt="Gedung Kejaksaan Negeri Purbalingga"
             className="rounded-2xl w-full h-[380px] object-cover shadow-xl" />
        <button className="absolute inset-0 m-auto w-16 h-16 rounded-full text-white flex items-center justify-center shadow-xl"
                style={{ background: EMAS }} aria-label="Putar video profil">
          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </button>
        <div className="absolute bottom-5 left-5 bg-[#0d2818]/90 text-white rounded-xl px-5 py-3">
          <p className="font-semibold text-sm">Profil Kejaksaan Negeri Purbalingga</p>
          <p className="text-xs text-white/60">Tonton Video</p>
        </div>
      </div>
      <div>
        <p className="tracking-[0.25em] text-xs mb-3" style={{ color: EMAS }}>TENTANG KAMI</p>
        <h2 className="text-3xl font-bold mb-5">Kejaksaan Negeri<br />Purbalingga</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{pengaturan.tentang_deskripsi}</p>
        <div className="flex gap-8 mb-8">
          {[['Profesional', 'Dalam penegakan hukum'], ['Transparan', 'Dalam pelayanan publik'], ['Akuntabel', 'Dalam setiap tindakan']].map(([t, s]) => (
            <div key={t} className="flex items-start gap-2">
              <span style={{ color: EMAS }}><Ikon d={ikonCheck} className="w-6 h-6" /></span>
              <span><p className="font-semibold text-sm">{t}</p><p className="text-xs text-gray-500">{s}</p></span>
            </div>
          ))}
        </div>
        <a href="#" className="inline-flex items-center gap-2 font-semibold text-sm"
           style={{ color: EMAS }}>Selengkapnya <Ikon d={ikonPanah} className="w-4 h-4" /></a>
      </div>
    </section>
  )
}

function Layanan({ items }) {
  return (
    <section id="layanan" className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">LAYANAN KAMI</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md">Berbagai layanan hukum dan informasi yang dapat diakses oleh masyarakat.</p>
        </div>
        <a href="#" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold" style={{ color: EMAS }}>
          Lihat Semua Layanan <Ikon d={ikonPanah} className="w-4 h-4" />
        </a>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((l) => (
          <div key={l.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
            <img src={l.gambar} alt={l.judul} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="font-bold mb-2">{l.judul}</h3>
              <p className="text-sm text-gray-500 mb-4">{l.deskripsi}</p>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: EMAS }}>
                Selengkapnya <Ikon d={ikonPanah} className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Berita({ items }) {
  return (
    <section className="bg-[#0d2818] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="tracking-[0.25em] text-xs mb-3" style={{ color: EMAS }}>INFORMASI TERKINI</p>
            <h2 className="text-3xl font-bold">Berita & Kegiatan</h2>
            <p className="text-white/60 text-sm mt-2 max-w-lg">Ikuti perkembangan terbaru seputar kegiatan, program, dan informasi penting dari Kejaksaan Negeri Purbalingga.</p>
          </div>
          <a href="#" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold" style={{ color: EMAS }}>
            Lihat Semua Berita <Ikon d={ikonPanah} className="w-4 h-4" />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((b) => (
            <article key={b.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition">
              <div className="relative">
                <img src={b.gambar} alt={b.judul} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 text-[#0d2818] rounded-lg px-3 py-1.5 text-center font-bold"
                     style={{ background: EMAS }}>
                  <p className="text-xl leading-none">{hariDariTanggal(b.tanggal)}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-2">{b.judul}</h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">{b.ringkasan}</p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: EMAS }}>
                  Baca Selengkapnya <Ikon d={ikonPanah} className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TriKrama() {
  const items = [
    ['SATYA', 'Kesetiaan yang bersumber pada rasa jujur, baik terhadap Tuhan Yang Maha Esa, diri pribadi dan sesama manusia.'],
    ['ADHI', 'Kesempurnaan dalam bertugas dan berjiwa Pancasila serta bertanggung jawab terhadap Tuhan Yang Maha Esa, keluarga dan sesama manusia.'],
    ['WICAKSANA', 'Bijaksana dalam tutur kata dan tingkah laku, khususnya dalam menerapkan kewenangan dan kekuasaannya.'],
  ]
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-bold tracking-wide mb-2">TRI KRAMA ADHYAKSA</h2>
      <p className="text-gray-500 text-sm mb-12">Nilai dasar yang menjadi pedoman setiap insan Adhyaksa dalam menjalankan tugas dan pengabdian.</p>
      <div className="grid md:grid-cols-3 gap-10">
        {items.map(([t, d]) => (
          <div key={t}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                 style={{ background: '#f3ead0', color: '#8a6d1c' }}>
              <Ikon d={ikonCheck} />
            </div>
            <h3 className="font-bold tracking-widest mb-3" style={{ color: '#8a6d1c' }}>{t}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimoni({ items }) {
  const t = items[0]
  if (!t) return null
  return (
    <section className="relative py-20 text-white text-center overflow-hidden">
      <img src="/hukum.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#0d2818]/80" />
      <div className="relative max-w-3xl mx-auto px-6">
        <p className="text-5xl mb-4" style={{ color: EMAS }}>“</p>
        <p className="text-xl italic mb-6">{t.kutipan}</p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {(t.nama || '?').trim().charAt(0).toUpperCase()}
          </div>
          <div className="text-left"><p className="font-semibold text-sm">{t.nama}</p><p className="text-xs text-white/60">{t.peran}</p></div>
        </div>
      </div>
    </section>
  )
}

function CTA({ pengaturan }) {
  return (
    <section id="kontak" className="bg-[#0d2818] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-3 whitespace-pre-line">{pengaturan.cta_judul}</h2>
          <p className="text-white/60 text-sm">{pengaturan.cta_deskripsi}</p>
        </div>
        <a href="#" className="text-[#0d2818] font-semibold px-8 py-3.5 rounded-full shrink-0"
           style={{ background: `linear-gradient(135deg, ${EMAS}, #e3b94e)` }}>Hubungi Kami →</a>
      </div>
    </section>
  )
}

function Footer({ pengaturan }) {
  return (
    <footer className="bg-[#081b10] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[#0d2818] text-sm"
                 style={{ background: `linear-gradient(135deg, ${EMAS}, #e3b94e)` }}>KN</div>
            <div className="leading-tight"><p className="font-bold text-[15px]">Kejaksaan Negeri</p><p className="text-[13px]" style={{ color: EMAS }}>Purbalingga</p></div>
          </div>
          <p className="text-sm text-white/50 whitespace-pre-line">{pengaturan.alamat}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Navigasi</h4>
          <ul className="space-y-2.5 text-sm text-white/50">
            {['Beranda', 'Tentang Kami', 'Layanan', 'Informasi Publik', 'Berita', 'Kontak'].map(m => <li key={m}><a href="#" className="hover:text-white">{m}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Layanan Populer</h4>
          <ul className="space-y-2.5 text-sm text-white/50">
            {['LANTINGBARLING', 'Halo JPN', 'SIBETA', 'Pengaduan Masyarakat'].map(m => <li key={m}><a href="#" className="hover:text-white">{m}</a></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm">Ikuti Kami</h4>
          <div className="flex gap-3">
            {[ikonGlobe, ikonChat, ikonBuku].map((d, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <Ikon d={d} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <p>© 2026 Kejaksaan Negeri Purbalingga. All rights reserved.</p>
          <p><Link to="/admin" className="hover:text-white/70">Admin</Link> &nbsp;|&nbsp; Sitemap | Kebijakan Privasi | Syarat & Ketentuan</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const [konten, setKonten] = useState(KONTEN_DEFAULT)

  useEffect(() => {
    let aktif = true
    fetchKonten().then((k) => { if (aktif) setKonten(k) })
    return () => { aktif = false }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero pengaturan={konten.pengaturan} />
      <LayananCepat />
      <div className="pt-10"><Tentang pengaturan={konten.pengaturan} /></div>
      <Layanan items={konten.layanan} />
      <Berita items={konten.berita} />
      <TriKrama />
      <Testimoni items={konten.testimoni} />
      <CTA pengaturan={konten.pengaturan} />
      <Footer pengaturan={konten.pengaturan} />
    </div>
  )
}
