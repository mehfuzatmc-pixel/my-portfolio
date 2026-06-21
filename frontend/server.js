const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(payload));
}

async function readContacts() {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function saveContact(contact) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const contacts = await readContacts();
  contacts.push(contact);
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error('Request body is too large.'));
      }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function validateContact(data) {
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please provide a valid email address.' };
  }

  return { name, email, message };
}

async function handleContactPost(request, response) {
  try {
    const body = await readRequestBody(request);
    const data = JSON.parse(body || '{}');
    const validated = validateContact(data);

    if (validated.error) {
      sendJson(response, 400, { message: validated.error });
      return;
    }

    const contact = {
      id: crypto.randomUUID(),
      name: validated.name,
      email: validated.email,
      message: validated.message,
      createdAt: new Date().toISOString(),
      ip: request.socket.remoteAddress,
    };

    await saveContact(contact);
    sendJson(response, 201, {
      message: 'Contact submission saved successfully.',
      contact,
    });
  } catch (error) {
    sendJson(response, 500, {
      message: 'Unable to save contact submission.',
    });
  }
}

async function handleContactsGet(response) {
  try {
    const contacts = await readContacts();
    sendJson(response, 200, { contacts });
  } catch (error) {
    sendJson(response, 500, {
      message: 'Unable to load contact submissions.',
    });
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.url === '/api/contact' && request.method === 'POST') {
    await handleContactPost(request, response);
    return;
  }

  if (request.url === '/api/contacts' && request.method === 'GET') {
    await handleContactsGet(response);
    return;
  }

  sendJson(response, 404, { message: 'Route not found.' });
});

server.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
