const bcrypt = require('bcryptjs');
const { sql, getPool, closePool } = require('../db/pool');
const { ensureSchema } = require('../db/schema');

async function main() {
  const email = String(process.argv[2] || '').trim().toLowerCase();
  const password = String(process.argv[3] || '');
  const name = String(process.argv[4] || 'Portfolio Admin').trim();

  if (!email || !password) {
    console.error('Usage: npm run create-admin -- admin@example.com Password123! "Admin Name"');
    process.exitCode = 1;
    return;
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters long.');
    process.exitCode = 1;
    return;
  }

  await ensureSchema();

  const pool = await getPool();
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.request()
    .input('Name', sql.NVarChar(120), name)
    .input('Email', sql.NVarChar(255), email)
    .input('PasswordHash', sql.NVarChar(255), passwordHash)
    .query(`
      IF EXISTS (SELECT 1 FROM dbo.Users WHERE Email = @Email)
      BEGIN
        UPDATE dbo.Users
        SET Name = @Name,
            PasswordHash = @PasswordHash,
            IsAdmin = 1,
            UpdatedAt = SYSUTCDATETIME()
        OUTPUT inserted.Id, inserted.Name, inserted.Email, inserted.IsAdmin
        WHERE Email = @Email;
      END
      ELSE
      BEGIN
        INSERT INTO dbo.Users (Name, Email, PasswordHash, IsAdmin)
        OUTPUT inserted.Id, inserted.Name, inserted.Email, inserted.IsAdmin
        VALUES (@Name, @Email, @PasswordHash, 1);
      END;
    `);

  const user = result.recordset[0];
  console.log(`Admin account ready: ${user.Email}`);
}

main()
  .catch((error) => {
    console.error('Admin account setup failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
