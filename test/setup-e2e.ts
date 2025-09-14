import { config } from 'dotenv'
import { randomUUID } from 'node:crypto'
import { DataSource } from 'typeorm'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

function generateUniqueSchemaName() {
  return `test_${randomUUID().replace(/-/g, '')}`
}

const schemaName = generateUniqueSchemaName()
process.env.TYPEORM_SCHEMA = schemaName

let adminDataSource: DataSource

beforeAll(async () => {
  adminDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  await adminDataSource.initialize()
  await adminDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
})

afterAll(async () => {
  if (adminDataSource && adminDataSource.isInitialized) {
    await adminDataSource.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`)
    await adminDataSource.destroy()
  }
})