const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../db/pool');
const env = require('../config/env');
const { validateSignin, validateSignup } = require('../utils/validation');

function toPublicUser(record) {
  return {
    id: record.Id,
    name: record.Name,
    email: record.Email,
    isAdmin: Boolean(record.IsAdmin),
    createdAt: record.CreatedAt,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.Id,
      email: user.Email,
      name: user.Name,
      isAdmin: Boolean(user.IsAdmin),
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

async function signup(request, response, next) {
  try {
    if (!env.allowPublicSignup) {
      return response.status(403).json({
        message: 'Public signup is disabled for this portfolio.',
      });
    }

    const validated = validateSignup(request.body);

    if (validated.error) {
      return response.status(400).json({ message: validated.error });
    }

    const pool = await getPool();
    const existing = await pool.request()
      .input('Email', sql.NVarChar(255), validated.email)
      .query('SELECT TOP 1 Id FROM dbo.Users WHERE Email = @Email');

    if (existing.recordset.length > 0) {
      return response.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);
    const isAdmin = env.adminEmails.includes(validated.email);
    const result = await pool.request()
      .input('Name', sql.NVarChar(120), validated.name)
      .input('Email', sql.NVarChar(255), validated.email)
      .input('PasswordHash', sql.NVarChar(255), passwordHash)
      .input('IsAdmin', sql.Bit, isAdmin)
      .query(`
        INSERT INTO dbo.Users (Name, Email, PasswordHash, IsAdmin)
        OUTPUT inserted.Id, inserted.Name, inserted.Email, inserted.IsAdmin, inserted.CreatedAt
        VALUES (@Name, @Email, @PasswordHash, @IsAdmin);
      `);

    const user = result.recordset[0];
    const token = createToken(user);

    return response.status(201).json({
      message: 'Signup successful.',
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function signin(request, response, next) {
  try {
    const validated = validateSignin(request.body);

    if (validated.error) {
      return response.status(400).json({ message: validated.error });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('Email', sql.NVarChar(255), validated.email)
      .query(`
        SELECT TOP 1 Id, Name, Email, PasswordHash, IsAdmin, CreatedAt
        FROM dbo.Users
        WHERE Email = @Email;
      `);

    const user = result.recordset[0];

    if (!user) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(validated.password, user.PasswordHash);

    if (!passwordMatches) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user);

    return response.status(200).json({
      message: 'Signin successful.',
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function me(request, response) {
  return response.status(200).json({
    user: {
      id: request.user.id,
      name: request.user.name,
      email: request.user.email,
      isAdmin: Boolean(request.user.isAdmin),
    },
  });
}

module.exports = {
  signup,
  signin,
  me,
};
