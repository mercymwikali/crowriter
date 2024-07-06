const express = require('express');
const { getAllInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');

const router = express.Router();

router.get('/list', getAllInvoices);
router.get('/user/:id', getInvoice);
router.post('/create', createInvoice);
router.put('/update/:id', updateInvoice);
router.delete('/delete/:id', deleteInvoice);

module.exports = router;
