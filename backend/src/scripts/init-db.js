const sql = require('mssql');
const env = require('../config/env');
const { ensureSchema } = require('../db/schema');
const { closePool } = require('../db/pool');

async function ensureDatabase() {
  const masterConfig = {
    ...env.db,
    database: 'master',
  };

  const pool = await sql.connect(masterConfig);

  try {
    await pool.request()
      .input('DatabaseName', sql.NVarChar(128), env.db.database)
      .query(`
        IF DB_ID(@DatabaseName) IS NULL
        BEGIN
          DECLARE @sql NVARCHAR(MAX) = N'CREATE DATABASE ' + QUOTENAME(@DatabaseName);
          EXEC(@sql);
        END;
      `);
  } finally {
    await pool.close();
  }
}

async function main() {
  await ensureDatabase();
  await ensureSchema();
  console.log(`Database and tables are ready: ${env.db.database}`);
}

main()
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
