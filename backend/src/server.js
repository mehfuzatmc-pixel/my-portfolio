const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { ensureSchema } = require('./db/schema');
const { closePool } = require('./db/pool');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS.'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Portfolio backend is running.',
    api: {
      health: '/api/health',
      signin: 'POST /api/auth/signin',
      me: 'GET /api/auth/me',
      consultationCheckout: 'POST /api/payments/consultation-checkout',
      contact: 'POST /api/contact',
      contacts: 'GET /api/contacts',
    },
  });
});

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok', service: 'portfolio-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', contactRoutes);

app.use((request, response) => {
  response.status(404).json({ message: 'Route not found.' });
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: 'Something went wrong on the server.' });
});

async function start() {
  await ensureSchema();

  const server = app.listen(env.port, () => {
    console.log(`Backend server running at http://localhost:${env.port}`);
  });

  async function shutdown() {
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch(async (error) => {
  console.error('Failed to start backend server:', error);
  await closePool();
  process.exit(1);
});
