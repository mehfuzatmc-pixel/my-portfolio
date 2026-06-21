const dotenv = require('dotenv');

dotenv.config();

const requiredInProduction = ['JWT_SECRET', 'DB_SERVER', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const dbServer = process.env.DB_SERVER || 'localhost';
const dbInstance = process.env.DB_INSTANCE || '';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

const dbConfig = {
  server: dbServer,
  database: process.env.DB_NAME || 'PortfolioDb',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: String(process.env.DB_ENCRYPT || 'false').toLowerCase() === 'true',
    trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERTIFICATE || 'true').toLowerCase() !== 'false',
  },
};

if (dbInstance) {
  dbConfig.options.instanceName = dbInstance;
} else if (dbPort) {
  dbConfig.port = dbPort;
}

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  allowedOrigins: String(process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || 'dev_only_change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  allowPublicSignup: String(process.env.ALLOW_PUBLIC_SIGNUP || 'false').toLowerCase() === 'true',
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  consultationCurrency: String(process.env.CONSULTATION_CURRENCY || 'usd').toLowerCase(),
  consultationAmount: Number(process.env.CONSULTATION_AMOUNT || 5000),
  adminEmails: String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
  db: dbConfig,
};

module.exports = env;
