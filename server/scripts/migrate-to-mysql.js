/**
 * Script Migrasi Terukur: SQLite -> MySQL
 * Memindahkan seluruh data dari file SQLite lokal ke database MySQL secara transaksional,
 * terukur, dan aman dari inkonsistensi foreign key.
 *
 * Cara pakai:
 *   1. Buat / sesuaikan .env di folder server/ dengan DB_CLIENT=mysql dan kredensialnya.
 *   2. Jalankan: node scripts/migrate-to-mysql.js
 *      atau: npm run migrate:mysql (dari root project)
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { performance } from 'node:perf_hooks'
import dotenv from 'dotenv'
import Database from 'better-sqlite3'
import knexLib from 'knex'
import knexConfig from '../knexfile.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const sqlitePath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'kejari.db')

async function main() {
  console.log('==================================================================')
  console.log('  MIGRASI TERUKUR BASIS DATA: SQLITE -> MYSQL')
  console.log('  Kejaksaan Negeri Purbalingga CMS Backend')
  console.log('==================================================================\n')

  const totalStartTime = performance.now()

  // 1. Validasi database sumber SQLite
  console.log(`[1/5] Memeriksa basis data sumber (SQLite)...`)
  let sqlite
  try {
    sqlite = new Database(sqlitePath, { readonly: true })
    console.log(`      ✓ SQLite terhubung: ${sqlitePath}`)
  } catch (err) {
    console.error(`      ✗ Gagal membuka file SQLite: ${err.message}`)
    process.exit(1)
  }

  // 2. Inisialisasi koneksi target MySQL
  const mysqlHost = process.env.DB_HOST || '127.0.0.1'
  const mysqlPort = process.env.DB_PORT || 3306
  const mysqlUser = process.env.DB_USER || 'root'
  const mysqlDatabase = process.env.DB_NAME || 'kejari_db'

  console.log(`\n[2/5] Menghubungkan ke basis data target (MySQL)...`)
  console.log(`      Target: ${mysqlUser}@${mysqlHost}:${mysqlPort}/${mysqlDatabase}`)

  // Buat koneksi awal untuk memastikan database target ada
  const rootKnex = knexLib({
    client: 'mysql2',
    connection: {
      host: mysqlHost,
      port: Number(mysqlPort),
      user: mysqlUser,
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4',
    },
  })

  try {
    await rootKnex.raw(`CREATE DATABASE IF NOT EXISTS \`${mysqlDatabase}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`      ✓ Database MySQL '${mysqlDatabase}' siap`)
  } catch (err) {
    console.error(`      ✗ Gagal menghubungkan atau membuat database MySQL: ${err.message}`)
    console.error('      Pastikan server MySQL berjalan dan kredensial di .env sudah benar.')
    await rootKnex.destroy()
    sqlite.close()
    process.exit(1)
  } finally {
    await rootKnex.destroy()
  }

  // Koneksi Knex ke database target MySQL
  const mysql = knexLib({
    ...knexConfig.production,
    client: 'mysql2',
    connection: {
      host: mysqlHost,
      port: Number(mysqlPort),
      user: mysqlUser,
      password: process.env.DB_PASSWORD || '',
      database: mysqlDatabase,
      charset: 'utf8mb4',
    },
  })

  // 3. Jalankan Migrasi Skema ke MySQL
  console.log(`\n[3/5] Menjalankan migrasi skema terstruktur di MySQL...`)
  try {
    const [batchNo, logFiles] = await mysql.migrate.latest({
      directory: path.join(__dirname, '..', 'migrations'),
      tableName: 'knex_migrations',
    })
    console.log(`      ✓ Migrasi skema selesai (Batch ${batchNo}): ${logFiles.length} file diterapkan.`)
  } catch (err) {
    console.error(`      ✗ Gagal migrasi skema di MySQL: ${err.message}`)
    await mysql.destroy()
    sqlite.close()
    process.exit(1)
  }

  // 4. Migrasi Data secara Terukur & Transaksional
  console.log(`\n[4/5] Memindahkan data tabel secara terstruktur...`)

  // Urutan tabel penting untuk integritas referensial (admin sebelum sesi)
  const tabelUrutan = ['admin', 'sesi', 'berita', 'layanan', 'testimoni', 'pengaturan']
  const laporan = []

  const trx = await mysql.transaction()

  try {
    // Nonaktifkan pemeriksaan FK sementara saat import data
    await trx.raw('SET FOREIGN_KEY_CHECKS = 0')

    for (const tabel of tabelUrutan) {
      const tStart = performance.now()

      // Ambil data sumber dari SQLite
      const rows = sqlite.prepare(`SELECT * FROM ${tabel}`).all()

      // Bersihkan tabel target di MySQL
      await trx(tabel).del()

      // Masukkan batch ke MySQL
      if (rows.length > 0) {
        // Chunk jika record banyak
        const chunkSize = 100
        for (let i = 0; i < rows.length; i += chunkSize) {
          const chunk = rows.slice(i, i + chunkSize)
          await trx(tabel).insert(chunk)
        }
      }

      const tEnd = performance.now()
      const durasiMs = Math.round(tEnd - tStart)

      // Verifikasi hitungan di target
      const countRes = await trx(tabel).count('* as count').first()
      const targetCount = Number(countRes.count)

      laporan.push({
        Tabel: tabel,
        'Sumber (SQLite)': rows.length,
        'Target (MySQL)': targetCount,
        'Status': rows.length === targetCount ? 'OK' : 'MISMATCH',
        'Durasi (ms)': `${durasiMs} ms`,
      })
    }

    await trx.raw('SET FOREIGN_KEY_CHECKS = 1')
    await trx.commit()
    console.log(`      ✓ Seluruh transaksi commit berhasil tanpa konflik.`)
  } catch (err) {
    await trx.rollback()
    console.error(`      ✗ Terjadi kesalahan saat migrasi data, transaksi di-rollback: ${err.message}`)
    await mysql.destroy()
    sqlite.close()
    process.exit(1)
  }

  // 5. Tampilkan Ringkasan Metrik Terukur
  console.log(`\n[5/5] Ringkasan Metrik Migrasi:`)
  console.table(laporan)

  const totalEndTime = performance.now()
  const totalDuration = ((totalEndTime - totalStartTime) / 1000).toFixed(2)

  console.log(`\n==================================================================`)
  console.log(`  ✓ MIGRASI BERHASIL SELESAI DALAM ${totalDuration} DETIK!`)
  console.log(`  Untuk menggunakan MySQL di backend:`)
  console.log(`    Set DB_CLIENT=mysql di server/.env`)
  console.log(`==================================================================\n`)

  sqlite.close()
  await mysql.destroy()
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
