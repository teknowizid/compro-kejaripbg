import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const dbClient = (process.env.DB_CLIENT || 'sqlite').toLowerCase()
const isMySQL = dbClient === 'mysql' || dbClient === 'mysql2'

const config = {
  client: isMySQL ? 'mysql2' : 'better-sqlite3',
  connection: isMySQL
    ? {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'kejari_db',
        charset: 'utf8mb4',
      }
    : {
        filename: process.env.DB_PATH || path.join(__dirname, 'data', 'kejari.db'),
      },
  useNullAsDefault: true,
  pool: isMySQL
    ? {
        min: Number(process.env.DB_POOL_MIN) || 2,
        max: Number(process.env.DB_POOL_MAX) || 10,
      }
    : { min: 1, max: 1 },
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    tableName: 'knex_migrations',
    loadExtensions: ['.js'],
  },
}

export default {
  development: config,
  production: config,
}
