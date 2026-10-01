import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api, setToken, clearToken, getToken, GAMBAR_TERSEDIA, hariDariTanggal } from '../lib/api.js'

// ==========================================
// IKON SVG CLEAN & RINGAN
// ==========================================
function Ikon({ name, className = 'w-5 h-5' }) {
  const icons = {
    newspaper: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    ),
    briefcase: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    ),
    chat: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    ),
    sliders: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    ),
    plus: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    ),
    edit: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    ),
    external: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    ),
    logout: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    ),
    x: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    ),
    alert: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    ),
    eye: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    ),
    eyeOff: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    ),
    menu: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    ),
    refresh: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    ),
    photo: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    ),
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      {icons[name] || icons.sliders}
    </svg>
  )
}

// ==========================================
// TOAST NOTIFIKASI MODERN
// ==========================================
function Toast({ toast, onClose }) {
  if (!toast.show) return null
  const isError = toast.type === 'error'

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-once">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border backdrop-blur-md ${
        isError
          ? 'bg-red-900/90 text-red-100 border-red-700/60 shadow-red-950/20'
          : 'bg-[#0d2818]/95 text-emerald-100 border-[#c9a227]/40 shadow-emerald-950/20'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-400' : 'bg-[#c9a227]'}`} />
        <span>{toast.message}</span>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition">
          <Ikon name="x" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ==========================================
// MODAL KONFIRMASI HAPUS
// ==========================================
function ModalKonfirmasi({ isOpen, title, itemTitle, onConfirm, onCancel, loading }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Ikon name="alert" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{title}</h3>
            <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          Apakah Anda yakin ingin menghapus data <strong className="text-slate-900 font-semibold">"{itemTitle}"</strong>?
        </p>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Menghapus...' : 'Ya, Hapus Data'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// KOMPONEN FORM INPUT
// ==========================================
function FormField({ label, helper, required, ...props }) {
  return (
    <label className="block mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {helper && <span className="text-xs text-slate-400">{helper}</span>}
      </div>
      <input
        {...props}
        required={required}
        className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227] focus:border-transparent"
      />
    </label>
  )
}

function FormArea({ label, helper, required, ...props }) {
  return (
    <label className="block mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {helper && <span className="text-xs text-slate-400">{helper}</span>}
      </div>
      <textarea
        {...props}
        rows={props.rows || 3}
        required={required}
        className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227] focus:border-transparent"
      />
    </label>
  )
}

function FormGambarPicker({ label, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="text-xs font-medium text-[#c9a227] hover:text-[#b8941f] underline transition"
        >
          {showPicker ? 'Tutup Pilihan Gambar' : 'Pilih Gambar dari Galeri'}
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Ikon name="photo" className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div className="flex-1">
          <input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/nama-file.jpg"
            className="w-full bg-slate-50/80 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Path relatif di folder <code>public/</code> (contoh: <code>/upacara.jpg</code>)
          </p>
        </div>
      </div>

      {showPicker && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-2">Klik gambar untuk memilih:</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {GAMBAR_TERSEDIA.map((g) => {
              const isSelected = value === g
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => { onChange(g); setShowPicker(false) }}
                  className={`group relative rounded-lg overflow-hidden border-2 transition aspect-video ${
                    isSelected ? 'border-[#c9a227] ring-2 ring-[#c9a227]/40' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={g} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#0d2818]/60 flex items-center justify-center text-white">
                      <Ikon name="check" className="w-4 h-4 text-[#c9a227]" />
                    </div>
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-[9px] text-white px-1 py-0.5 truncate text-center">
                    {g.replace('/', '')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function TombolAksi({ children, variant = 'primary', icon, loading = false, className = '', ...props }) {
  let style = ''
  if (variant === 'primary') {
    style = 'bg-gradient-to-r from-[#c9a227] to-[#e3b94e] text-[#0d2818] hover:from-[#b8941f] hover:to-[#d4aa3f] shadow-sm font-bold'
  } else if (variant === 'dark') {
    style = 'bg-[#0d2818] text-white hover:bg-[#14532d] shadow-sm font-semibold'
  } else if (variant === 'danger') {
    style = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold'
  } else {
    style = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-semibold'
  }

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition disabled:opacity-50 ${style} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <Ikon name={icon} className="w-4 h-4" />
      )}
      {children}
    </button>
  )
}

// ==========================================
// TAB CRUD DATA (BERITA, LAYANAN, TESTIMONI)
// ==========================================
const SKEMA_KOLOM = {
  berita: [
    { key: 'judul', label: 'Judul Berita', tipe: 'text', required: true },
    { key: 'tanggal', label: 'Tanggal Publikasi', tipe: 'tanggal', required: true },
    { key: 'gambar', label: 'Foto Berita', tipe: 'gambar' },
    { key: 'ringkasan', label: 'Ringkasan / Isi Singkat', tipe: 'area', rows: 4, required: true },
  ],
  layanan: [
    { key: 'judul', label: 'Nama Layanan', tipe: 'text', required: true },
    { key: 'gambar', label: 'Ikon / Gambar Layanan', tipe: 'gambar' },
    { key: 'deskripsi', label: 'Deskripsi Layanan', tipe: 'area', rows: 4, required: true },
  ],
  testimoni: [
    { key: 'nama', label: 'Nama Tokoh / Masyarakat', tipe: 'text', required: true },
    { key: 'peran', label: 'Peran / Instansi', tipe: 'text', required: true },
    { key: 'kutipan', label: 'Pernyataan / Kutipan', tipe: 'area', rows: 4, required: true },
  ],
}

function CrudTab({ nama, label, deskripsi, icon, onNotify, onUpdateCount }) {
  const kolom = SKEMA_KOLOM[nama]
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, loading: false })

  const muatData = async () => {
    setLoading(true)
    try {
      const data = await api.list(nama)
      setRows(data)
      if (onUpdateCount) onUpdateCount(nama, data.length)
    } catch (err) {
      onNotify('Gagal memuat data: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    muatData()
  }, [nama])

  // Filter pencarian
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => {
      const text = `${r.judul || ''} ${r.nama || ''} ${r.ringkasan || ''} ${r.deskripsi || ''} ${r.kutipan || ''} ${r.peran || ''}`.toLowerCase()
      return text.includes(q)
    })
  }, [rows, search])

  const handleBukaTambah = () => {
    setEditing(null)
    const initial = {}
    kolom.forEach((k) => {
      initial[k.key] = k.key === 'tanggal' ? new Date().toISOString().slice(0, 10) : ''
    })
    setForm(initial)
    setShowModal(true)
  }

  const handleBukaEdit = (row) => {
    setEditing(row)
    const initial = {}
    kolom.forEach((k) => {
      initial[k.key] = row[k.key] ?? ''
    })
    setForm(initial)
    setShowModal(true)
  }

  const handleSimpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.update(nama, editing.id, form)
        onNotify(`Data "${form.judul || form.nama}" berhasil diperbarui.`)
      } else {
        await api.create(nama, form)
        onNotify(`Data "${form.judul || form.nama}" berhasil ditambahkan.`)
      }
      setShowModal(false)
      await muatData()
    } catch (err) {
      onNotify('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleKonfirmasiHapus = (row) => {
    setDeleteModal({ open: true, item: row, loading: false })
  }

  const eksekusiHapus = async () => {
    if (!deleteModal.item) return
    setDeleteModal((prev) => ({ ...prev, loading: true }))
    try {
      await api.remove(nama, deleteModal.item.id)
      onNotify(`Data berhasil dihapus.`)
      setDeleteModal({ open: false, item: null, loading: false })
      await muatData()
    } catch (err) {
      onNotify('Gagal menghapus: ' + err.message, 'error')
      setDeleteModal((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <div>
      {/* Header Bagian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#0d2818]/10 text-[#0d2818] flex items-center justify-center">
              <Ikon name={icon} className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">{label}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{deskripsi}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={muatData}
            title="Muat ulang data"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          >
            <Ikon name="refresh" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <TombolAksi variant="primary" icon="plus" onClick={handleBukaTambah}>
            Tambah {label.split(' ')[0]}
          </TombolAksi>
        </div>
      </div>

      {/* Bar Pencarian & Statistik */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Ikon name="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Cari ${label.toLowerCase()}...`}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Ikon name="x" className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 self-center">
          Menampilkan <span className="font-semibold text-slate-800">{filteredRows.length}</span> dari {rows.length} entri
        </div>
      </div>

      {/* Konten Data */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
          <span className="w-6 h-6 border-2 border-[#0d2818] border-t-transparent rounded-full animate-spin inline-block mb-3" />
          <p className="text-sm">Memuat data dari database...</p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Ikon name="search" className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-700 text-base mb-1">
            {search ? 'Tidak ada hasil yang cocok' : 'Belum ada data'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            {search
              ? `Tidak ditemukan data yang sesuai dengan kata kunci "${search}".`
              : `Mulai kelola konten dengan menambahkan entri pertama Anda.`}
          </p>
          {!search && (
            <TombolAksi variant="primary" icon="plus" onClick={handleBukaTambah}>
              Tambah Data Sekarang
            </TombolAksi>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredRows.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 transition shadow-xs hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 group"
            >
              {/* Thumbnail */}
              {r.gambar ? (
                <img
                  src={r.gambar}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <Ikon name="photo" className="w-6 h-6" />
                </div>
              )}

              {/* Info Utama */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-[#14532d] transition">
                    {r.judul || r.nama}
                  </h4>
                  {nama === 'berita' && r.tanggal && (
                    <span className="text-[11px] font-semibold bg-[#0d2818] text-[#e3b94e] px-2 py-0.5 rounded-md shrink-0">
                      Tgl: {r.tanggal} ({hariDariTanggal(r.tanggal)})
                    </span>
                  )}
                  {nama === 'testimoni' && r.peran && (
                    <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                      {r.peran}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {r.ringkasan || r.deskripsi || r.kutipan || '-'}
                </p>
              </div>

              {/* Aksi */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleBukaEdit(r)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  <Ikon name="edit" className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleKonfirmasiHapus(r)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 transition"
                >
                  <Ikon name="trash" className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSimpan}
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100"
          >
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#c9a227]/20 text-[#0d2818] flex items-center justify-center">
                  <Ikon name={editing ? 'edit' : 'plus'} className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  {editing ? 'Edit' : 'Tambah'} {label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <Ikon name="x" className="w-5 h-5" />
              </button>
            </div>

            {/* Isi Form */}
            <div className="p-6 overflow-y-auto space-y-1">
              {kolom.map((k) =>
                k.tipe === 'area' ? (
                  <FormArea
                    key={k.key}
                    label={k.label}
                    required={k.required}
                    rows={k.rows || 3}
                    value={form[k.key] || ''}
                    onChange={(e) => setForm({ ...form, [k.key]: e.target.value })}
                  />
                ) : k.tipe === 'gambar' ? (
                  <FormGambarPicker
                    key={k.key}
                    label={k.label}
                    value={form[k.key] || ''}
                    onChange={(val) => setForm({ ...form, [k.key]: val })}
                  />
                ) : (
                  <FormField
                    key={k.key}
                    label={k.label}
                    type={k.tipe === 'tanggal' ? 'date' : 'text'}
                    required={k.required}
                    value={form[k.key] || ''}
                    onChange={(e) => setForm({ ...form, [k.key]: e.target.value })}
                  />
                )
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <TombolAksi type="submit" variant="primary" loading={saving}>
                {editing ? 'Simpan Perubahan' : 'Tambahkan Data'}
              </TombolAksi>
            </div>
          </form>
        </div>
      )}

      {/* Modal Hapus */}
      <ModalKonfirmasi
        isOpen={deleteModal.open}
        title={`Hapus ${label.split(' ')[0]}`}
        itemTitle={deleteModal.item ? (deleteModal.item.judul || deleteModal.item.nama) : ''}
        loading={deleteModal.loading}
        onConfirm={eksekusiHapus}
        onCancel={() => setDeleteModal({ open: false, item: null, loading: false })}
      />
    </div>
  )
}

// ==========================================
// TAB PENGATURAN TEKS WEBSITE
// ==========================================
const GRUP_PENGATURAN = [
  {
    title: 'Bagian Hero (Halaman Utama)',
    desc: 'Teks sambutan yang pertama kali dilihat pengunjung di banner atas',
    badge: 'Hero Section',
    fields: [
      { key: 'hero_deskripsi', label: 'Deskripsi Hero', rows: 3, helper: 'Teks pengantar di samping judul utama' },
      { key: 'hero_kutipan', label: 'Kutipan pada Foto Hero', rows: 2, helper: 'Kutipan formal di kartu melayang foto hero' },
    ],
  },
  {
    title: 'Tentang Kami',
    desc: 'Komitmen, visi, dan deskripsi institusi Kejaksaan Negeri Purbalingga',
    badge: 'Profil Lembaga',
    fields: [
      { key: 'tentang_deskripsi', label: 'Deskripsi Tentang Kami', rows: 4, helper: 'Penjelasan komitmen dan integritas pelayanan' },
    ],
  },
  {
    title: 'Bagian Ajakan (Call to Action)',
    desc: 'Teks promosi layanan terpadu dan kontak di bagian bawah website',
    badge: 'CTA Banner',
    fields: [
      { key: 'cta_judul', label: 'Judul CTA', rows: 2, helper: 'Judul ajakan utama' },
      { key: 'cta_deskripsi', label: 'Deskripsi CTA', rows: 3, helper: 'Penjelasan singkat ajakan konsultasi/layanan' },
    ],
  },
  {
    title: 'Informasi Kontak & Footer',
    desc: 'Alamat kantor resmi yang tampil di footer halaman',
    badge: 'Footer',
    fields: [
      { key: 'alamat', label: 'Alamat Kantor Lengkap', rows: 2, helper: 'Gunakan baris baru untuk memisahkan baris alamat' },
    ],
  },
]

function PengaturanTab({ onNotify }) {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getPengaturan()
      .then((res) => {
        setForm(res)
        setLoading(false)
      })
      .catch((err) => {
        onNotify('Gagal memuat pengaturan: ' + err.message, 'error')
        setLoading(false)
      })
  }, [])

  const handleSimpan = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.savePengaturan(form)
      onNotify('Pengaturan teks website berhasil diperbarui.')
    } catch (err) {
      onNotify('Gagal menyimpan: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
        <span className="w-6 h-6 border-2 border-[#0d2818] border-t-transparent rounded-full animate-spin inline-block mb-3" />
        <p className="text-sm">Memuat pengaturan website...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSimpan}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#0d2818]/10 text-[#0d2818] flex items-center justify-center">
              <Ikon name="sliders" className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Pengaturan Teks Website</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ubah teks dinamis pada halaman utama. Perubahan langsung tersimpan ke database CMS.
          </p>
        </div>

        <TombolAksi type="submit" variant="primary" icon="check" loading={saving}>
          Simpan Semua Pengaturan
        </TombolAksi>
      </div>

      <div className="grid gap-6">
        {GRUP_PENGATURAN.map((grup, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{grup.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{grup.desc}</p>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
                {grup.badge}
              </span>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              {grup.fields.map((f) => (
                <FormArea
                  key={f.key}
                  label={f.label}
                  helper={f.helper}
                  rows={f.rows}
                  value={form[f.key] || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <TombolAksi type="submit" variant="primary" icon="check" loading={saving} className="px-6 py-2.5">
          Simpan Semua Pengaturan
        </TombolAksi>
      </div>
    </form>
  )
}

// ==========================================
// TAB KEAMANAN & AKUN ADMIN
// ==========================================
function AkunTab({ username, onNotify }) {
  const [lama, setLama] = useState('')
  const [baru, setBaru] = useState('')
  const [baru2, setBaru2] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleGantiPassword = async (e) => {
    e.preventDefault()
    if (baru.length < 6) {
      onNotify('Password baru minimal 6 karakter.', 'error')
      return
    }
    if (baru !== baru2) {
      onNotify('Konfirmasi password baru tidak cocok.', 'error')
      return
    }

    setLoading(true)
    try {
      await api.gantiPassword(lama, baru)
      onNotify('Password akun berhasil diperbarui.')
      setLama('')
      setBaru('')
      setBaru2('')
    } catch (err) {
      onNotify('Gagal mengganti password: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="pb-6 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#0d2818]/10 text-[#0d2818] flex items-center justify-center">
            <Ikon name="shield" className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Keamanan & Akun</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Kelola kredensial administrator dan keamanan login CMS.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Info Profil */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-[#0d2818] text-2xl shadow-lg mb-4"
            style={{ background: 'linear-gradient(135deg, #c9a227, #e3b94e)' }}
          >
            KN
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{username}</h3>
          <span className="inline-block mt-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Super Administrator
          </span>

          <div className="mt-6 pt-6 border-t border-slate-100 w-full text-left space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Institusi:</span>
              <span className="font-semibold text-slate-700">Kejari Purbalingga</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Tipe Enkripsi:</span>
              <span className="font-semibold text-slate-700">Scrypt Salted</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Status Sesi:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Form Ganti Password */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Ganti Password Administrator</h3>
              <p className="text-xs text-slate-500">Perbarui kata sandi secara berkala untuk menjaga keamanan</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            >
              <Ikon name={showPassword ? 'eyeOff' : 'eye'} className="w-4 h-4" />
              {showPassword ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          <form onSubmit={handleGantiPassword} className="space-y-4 pt-2 border-t border-slate-100">
            <FormField
              label="Password Saat Ini"
              type={showPassword ? 'text' : 'password'}
              required
              value={lama}
              onChange={(e) => setLama(e.target.value)}
              placeholder="Masukkan password lama"
            />
            <FormField
              label="Password Baru"
              type={showPassword ? 'text' : 'password'}
              required
              value={baru}
              onChange={(e) => setBaru(e.target.value)}
              placeholder="Minimal 6 karakter"
              helper="Gunakan kombinasi huruf dan angka"
            />
            <FormField
              label="Konfirmasi Password Baru"
              type={showPassword ? 'text' : 'password'}
              required
              value={baru2}
              onChange={(e) => setBaru2(e.target.value)}
              placeholder="Ulangi password baru"
            />

            <div className="pt-2 flex justify-end">
              <TombolAksi type="submit" variant="primary" icon="shield" loading={loading}>
                Perbarui Password
              </TombolAksi>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// HALAMAN UTAMA DASHBOARD ADMIN
// ==========================================
const MENU_SIDEBAR = [
  { id: 'berita', label: 'Berita & Kegiatan', icon: 'newspaper', badgeKey: 'berita' },
  { id: 'layanan', label: 'Layanan Publik', icon: 'briefcase', badgeKey: 'layanan' },
  { id: 'testimoni', label: 'Testimoni', icon: 'chat', badgeKey: 'testimoni' },
  { id: 'pengaturan', label: 'Pengaturan Teks', icon: 'sliders' },
  { id: 'akun', label: 'Keamanan Akun', icon: 'shield' },
]

export default function Admin() {
  const [siap, setSiap] = useState(false)
  const [username, setUsername] = useState(null)
  const [tabAktif, setTabAktif] = useState('berita')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Statistik ringkasan
  const [counts, setCounts] = useState({ berita: 0, layanan: 0, testimoni: 0 })

  // Form login state
  const [formLogin, setFormLogin] = useState({ username: '', password: '' })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [errorLogin, setErrorLogin] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const tampilkanToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3500)
  }

  const updateCount = (key, count) => {
    setCounts((prev) => ({ ...prev, [key]: count }))
  }

  // Cek sesi login
  useEffect(() => {
    if (!getToken()) {
      setSiap(true)
      return
    }
    api.me()
      .then((m) => {
        setUsername(m.username)
        // Ambil data jumlah awal
        api.list('berita').then((d) => updateCount('berita', d.length)).catch(() => {})
        api.list('layanan').then((d) => updateCount('layanan', d.length)).catch(() => {})
        api.list('testimoni').then((d) => updateCount('testimoni', d.length)).catch(() => {})
      })
      .catch(() => clearToken())
      .finally(() => setSiap(true))
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoadingLogin(true)
    setErrorLogin('')
    try {
      const res = await api.login(formLogin.username.trim(), formLogin.password)
      setToken(res.token)
      setUsername(res.username)
      tampilkanToast(`Selamat datang kembali, ${res.username}!`)
    } catch (err) {
      setErrorLogin(err.message)
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
    } catch {
      clearToken()
    }
    setUsername(null)
    tampilkanToast('Anda telah keluar dari sistem.')
  }

  if (!siap) {
    return (
      <div className="min-h-screen bg-[#0d2818] flex items-center justify-center text-white/70">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin inline-block mb-3" />
          <p className="text-sm font-medium">Memuat portal administrasi...</p>
        </div>
      </div>
    )
  }

  // Tampilan Login Jika Belum Masuk
  if (!username) {
    return (
      <div className="min-h-screen bg-radial from-[#14532d] via-[#0d2818] to-[#08180e] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card Utama */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Header Branding */}
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center font-bold text-[#0d2818] text-xl mb-4 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #c9a227, #e3b94e)' }}
              >
                KN
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Portal Administrasi</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Kejaksaan Negeri Purbalingga
              </p>
            </div>

            {errorLogin && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3.5 mb-5 flex items-center gap-2.5">
                <Ikon name="alert" className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorLogin}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <FormField
                label="Nama Pengguna"
                placeholder="admin"
                required
                autoFocus
                value={formLogin.username}
                onChange={(e) => setFormLogin({ ...formLogin, username: e.target.value })}
              />

              <div className="relative">
                <FormField
                  label="Kata Sandi"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={formLogin.password}
                  onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 p-1"
                >
                  <Ikon name={showLoginPassword ? 'eyeOff' : 'eye'} className="w-4 h-4" />
                </button>
              </div>

              <TombolAksi
                type="submit"
                variant="primary"
                loading={loadingLogin}
                className="w-full py-3 text-sm rounded-xl mt-2 font-bold"
              >
                Masuk ke Dashboard
              </TombolAksi>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Kredensial default: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">admin</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">admin123</code>
              </p>
              <div className="mt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d2818] hover:text-[#c9a227] transition"
                >
                  ← Kembali ke Beranda Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tampilan Utama Dashboard Terpadu
  const currentMenu = MENU_SIDEBAR.find((m) => m.id === tabAktif) || MENU_SIDEBAR[0]

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex">
      {/* SIDEBAR DESKTOP & MOBILE */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d2818] text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[#0d2818] text-sm shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #c9a227, #e3b94e)' }}
            >
              KN
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-sm tracking-wide">KEJARI PURBALINGGA</h1>
              <p className="text-[11px] text-[#c9a227] font-medium tracking-wider">PANEL KONTROL CMS</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white p-1"
          >
            <Ikon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigasi */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Manajemen Konten
          </p>

          {MENU_SIDEBAR.slice(0, 3).map((item) => {
            const isActive = tabAktif === item.id
            const count = counts[item.badgeKey]
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTabAktif(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#14532d] text-white border-l-4 border-[#c9a227] shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Ikon name={item.icon} className={`w-4 h-4 ${isActive ? 'text-[#c9a227]' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
                {count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#c9a227] text-[#0d2818] font-bold' : 'bg-white/10 text-white/60'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}

          <p className="px-3 pt-5 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Sistem & Konfigurasi
          </p>

          {MENU_SIDEBAR.slice(3).map((item) => {
            const isActive = tabAktif === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTabAktif(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#14532d] text-white border-l-4 border-[#c9a227] shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ikon name={item.icon} className={`w-4 h-4 ${isActive ? 'text-[#c9a227]' : 'text-white/50'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Sidebar Footer User Widget */}
        <div className="p-4 border-t border-white/10 bg-[#091d11]">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 hover:text-white transition mb-3"
          >
            <span className="flex items-center gap-2">
              <Ikon name="external" className="w-4 h-4 text-[#c9a227]" />
              Lihat Website Live
            </span>
            <span className="text-[10px] text-white/40">Tab Baru ↗</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-[#e3b94e] font-bold text-xs flex items-center justify-center shrink-0">
                {username ? username[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{username}</p>
                <p className="text-[10px] text-white/50 truncate">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari sesi"
              className="text-white/50 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <Ikon name="logout" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Ikon name="menu" className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>CMS Dashboard</span>
                <span>/</span>
                <span className="font-semibold text-slate-700">{currentMenu.label}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 hidden sm:block">
                {currentMenu.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d2818] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition"
            >
              <Ikon name="external" className="w-3.5 h-3.5" />
              Website Utama
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition"
            >
              <Ikon name="logout" className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Quick Metrics Bar (Hanya tampil di tab konten) */}
          {(tabAktif === 'berita' || tabAktif === 'layanan' || tabAktif === 'testimoni') && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#14532d] flex items-center justify-center shrink-0">
                  <Ikon name="newspaper" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total Berita</p>
                  <p className="text-2xl font-bold text-slate-900">{counts.berita}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#c9a227] flex items-center justify-center shrink-0">
                  <Ikon name="briefcase" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Layanan Publik</p>
                  <p className="text-2xl font-bold text-slate-900">{counts.layanan}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Ikon name="chat" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Testimoni Warga</p>
                  <p className="text-2xl font-bold text-slate-900">{counts.testimoni}</p>
                </div>
              </div>
            </div>
          )}

          {/* Panel Konten Dinamis */}
          <div className="bg-white/80 backdrop-blur-xs rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
            {tabAktif === 'berita' && (
              <CrudTab
                nama="berita"
                label="Berita & Kegiatan"
                deskripsi="Kelola publikasi kegiatan resmi, siaran pers, dan dokumentasi program Kejari Purbalingga."
                icon="newspaper"
                onNotify={tampilkanToast}
                onUpdateCount={updateCount}
              />
            )}
            {tabAktif === 'layanan' && (
              <CrudTab
                nama="layanan"
                label="Layanan Publik"
                deskripsi="Daftar produk hukum dan pelayanan masyarakat seperti LANTINGBARLING, Halo JPN, dan SIBETA."
                icon="briefcase"
                onNotify={tampilkanToast}
                onUpdateCount={updateCount}
              />
            )}
            {tabAktif === 'testimoni' && (
              <CrudTab
                nama="testimoni"
                label="Testimoni Masyarakat"
                deskripsi="Apresiasi dan testimoni kepuasan warga terhadap pelayanan Kejaksaan Negeri Purbalingga."
                icon="chat"
                onNotify={tampilkanToast}
                onUpdateCount={updateCount}
              />
            )}
            {tabAktif === 'pengaturan' && (
              <PengaturanTab onNotify={tampilkanToast} />
            )}
            {tabAktif === 'akun' && (
              <AkunTab username={username} onNotify={tampilkanToast} />
            )}
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
    </div>
  )
}
