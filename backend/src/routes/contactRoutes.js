const express = require('express');
const { createContact, listContacts } = require('../controllers/contactController');
const { requireAdmin, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/contact', createContact);
router.get('/contacts', requireAuth, requireAdmin, listContacts);

module.exports = router;
