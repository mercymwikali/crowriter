const express = require('express');
const router = express.Router();
const {
    postPayment,
    getPayment,
    getAllPayments,
    writersPayment
} = require('../controllers/payments');

// POST /payments - Create a new payment
router.post('/create', postPayment);

// GET /payments/:id - Get a specific payment by ID
router.get('/details/:id', writersPayment);

// GET /payments - Get all payments
router.get('/list', getAllPayments);

module.exports = router;
