const jwt = require('jsonwebtoken');
const env = require('../config/env');

function requireAuth(request, response, next) {
  const header = request.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentication token is required.' });
  }

  try {
    request.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

function requireAdmin(request, response, next) {
  if (!request.user?.isAdmin) {
    return response.status(403).json({ message: 'Admin access is required.' });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
