const express = require('express');
const orderController = require('../controllers/Orders');
const cancelOrder = require('../controllers/CancelledJobs');
const assignmentController = require('../controllers/orderAssignment');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/filesMulterSetup'); // Import your multer configuration
const { verifyJwt } = require('../middleware/VerifyJwt');

// router.use(verifyJwt);
router.post('/create', upload.single('attachment'), orderController.createOrder);
router.patch('/update/:id', upload.single('attachment'), orderController.updateOrder);
router.get('/list/:freelancerId', orderController.getOrders);
router.get('/neworders', orderController.newOrdersList);
router.delete('/delete/:id', orderController.deleteOrder);
router.patch('/cancel', cancelOrder.changeStatus);

// Use POST for assigning an order to a freelancer
router.post('/assign', assignmentController.assignOrder);
router.get('/assign-list', assignmentController.getAssignedOrders);
router.patch('/extend-deadline/:orderId', assignmentController.extendDeadline);

router.patch('/reassign/:orderId', assignmentController.reassignOrder);

router.delete('/delete-assignment/:assignmentId', assignmentController.deleteAssignment);
router.get('/get-assignment/:freelancerId', assignmentController.getAssignedOrdersByFreelancer);


module.exports = router;
