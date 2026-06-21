function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignup(body) {
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required.' };
  }

  if (!isEmail(email)) {
    return { error: 'Please provide a valid email address.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  return { name, email, password };
}

function validateSignin(body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (!isEmail(email)) {
    return { error: 'Please provide a valid email address.' };
  }

  return { email, password };
}

function validateContact(body) {
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' };
  }

  if (!isEmail(email)) {
    return { error: 'Please provide a valid email address.' };
  }

  return { name, email, message };
}

module.exports = {
  validateSignup,
  validateSignin,
  validateContact,
};
