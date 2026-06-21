const express = require('express');
const { me, signin, signup } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', requireAuth, me);

module.exports = router;
