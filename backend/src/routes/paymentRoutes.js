const express = require('express');
const { createConsultationCheckout } = require('../controllers/paymentController');

const router = express.Router();

router.post('/consultation-checkout', createConsultationCheckout);

module.exports = router;
