const sql = require('mssql');
const env = require('../config/env');

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(env.db);
  }

  return poolPromise;
}

async function closePool() {
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
    poolPromise = undefined;
  }
}

module.exports = {
  sql,
  getPool,
  closePool,
};
