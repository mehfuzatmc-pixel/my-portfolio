const { sql, getPool, closePool } = require('../db/pool');

async function main() {
  const email = String(process.argv[2] || '').trim().toLowerCase();

  if (!email) {
    console.error('Usage: npm run promote-admin -- user@example.com');
    process.exitCode = 1;
    return;
  }

  const pool = await getPool();
  const result = await pool.request()
    .input('Email', sql.NVarChar(255), email)
    .query(`
      UPDATE dbo.Users
      SET IsAdmin = 1, UpdatedAt = SYSUTCDATETIME()
      OUTPUT inserted.Id, inserted.Name, inserted.Email, inserted.IsAdmin
      WHERE Email = @Email;
    `);

  const user = result.recordset[0];

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Promoted admin user: ${user.Email}`);
}

main()
  .catch((error) => {
    console.error('Admin promotion failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
