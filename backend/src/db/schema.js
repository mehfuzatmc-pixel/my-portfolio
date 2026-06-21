const { getPool } = require('./pool');

async function ensureSchema() {
  const pool = await getPool();

  await pool.request().query(`
    IF OBJECT_ID('dbo.Users', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(120) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        IsAdmin BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NULL
      );
    END;

    IF COL_LENGTH('dbo.Users', 'IsAdmin') IS NULL
    BEGIN
      ALTER TABLE dbo.Users
      ADD IsAdmin BIT NOT NULL
        CONSTRAINT DF_Users_IsAdmin DEFAULT 0;
    END;

    IF OBJECT_ID('dbo.ContactMessages', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.ContactMessages (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        Name NVARCHAR(120) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        Message NVARCHAR(MAX) NOT NULL,
        IpAddress NVARCHAR(64) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END;
  `);
}

module.exports = {
  ensureSchema,
};
