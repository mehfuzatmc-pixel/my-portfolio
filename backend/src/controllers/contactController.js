const { sql, getPool } = require('../db/pool');
const { validateContact } = require('../utils/validation');

function toContact(record) {
  return {
    id: record.Id,
    name: record.Name,
    email: record.Email,
    message: record.Message,
    ipAddress: record.IpAddress,
    createdAt: record.CreatedAt,
  };
}

async function createContact(request, response, next) {
  try {
    const validated = validateContact(request.body);

    if (validated.error) {
      return response.status(400).json({ message: validated.error });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('Name', sql.NVarChar(120), validated.name)
      .input('Email', sql.NVarChar(255), validated.email)
      .input('Message', sql.NVarChar(sql.MAX), validated.message)
      .input('IpAddress', sql.NVarChar(64), request.ip)
      .query(`
        INSERT INTO dbo.ContactMessages (Name, Email, Message, IpAddress)
        OUTPUT inserted.Id, inserted.Name, inserted.Email, inserted.Message, inserted.IpAddress, inserted.CreatedAt
        VALUES (@Name, @Email, @Message, @IpAddress);
      `);

    return response.status(201).json({
      message: 'Contact submission saved successfully.',
      contact: toContact(result.recordset[0]),
    });
  } catch (error) {
    return next(error);
  }
}

async function listContacts(request, response, next) {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, Name, Email, Message, IpAddress, CreatedAt
      FROM dbo.ContactMessages
      ORDER BY CreatedAt DESC;
    `);

    return response.status(200).json({
      contacts: result.recordset.map(toContact),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createContact,
  listContacts,
};
