/**
 * Migrasi Terstruktur: Skema Awal Basis Data (SQLite & MySQL Compatible)
 * Mendefinisikan tabel: berita, layanan, testimoni, pengaturan, admin, sesi.
 */
export async function up(knex) {
  // 1. Tabel Berita & Kegiatan
  if (!(await knex.schema.hasTable('berita'))) {
    await knex.schema.createTable('berita', (table) => {
      table.increments('id').primary()
      table.string('judul', 255).notNullable()
      table.text('ringkasan').notNullable().defaultTo('')
      table.string('gambar', 255).notNullable().defaultTo('/upacara.jpg')
      table.string('tanggal', 10).notNullable().defaultTo('')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.index(['tanggal'], 'idx_berita_tanggal')
    })
  }

  // 2. Tabel Layanan Publik
  if (!(await knex.schema.hasTable('layanan'))) {
    await knex.schema.createTable('layanan', (table) => {
      table.increments('id').primary()
      table.string('judul', 255).notNullable()
      table.text('deskripsi').notNullable().defaultTo('')
      table.string('gambar', 255).notNullable().defaultTo('/barang-bukti.jpg')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }

  // 3. Tabel Testimoni Masyarakat
  if (!(await knex.schema.hasTable('testimoni'))) {
    await knex.schema.createTable('testimoni', (table) => {
      table.increments('id').primary()
      table.string('nama', 255).notNullable()
      table.string('peran', 255).notNullable().defaultTo('')
      table.text('kutipan').notNullable().defaultTo('')
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }

  // 4. Tabel Pengaturan Teks Website (Key-Value)
  if (!(await knex.schema.hasTable('pengaturan'))) {
    await knex.schema.createTable('pengaturan', (table) => {
      table.string('kunci', 100).primary().notNullable()
      table.text('nilai').notNullable().defaultTo('')
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }

  // 5. Tabel Administrator
  if (!(await knex.schema.hasTable('admin'))) {
    await knex.schema.createTable('admin', (table) => {
      table.increments('id').primary()
      table.string('username', 100).unique().notNullable()
      table.string('password_hash', 255).notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.index(['username'], 'idx_admin_username')
    })
  }

  // 6. Tabel Sesi Token Login
  if (!(await knex.schema.hasTable('sesi'))) {
    await knex.schema.createTable('sesi', (table) => {
      table.string('token', 128).primary().notNullable()
      table.integer('admin_id').unsigned().notNullable()
        .references('id').inTable('admin').onDelete('CASCADE')
      table.timestamp('dibuat').defaultTo(knex.fn.now())
      table.index(['admin_id'], 'idx_sesi_admin')
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('sesi')
  await knex.schema.dropTableIfExists('admin')
  await knex.schema.dropTableIfExists('pengaturan')
  await knex.schema.dropTableIfExists('testimoni')
  await knex.schema.dropTableIfExists('layanan')
  await knex.schema.dropTableIfExists('berita')
}
