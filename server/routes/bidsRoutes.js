const express = require('express');
const bidController=require('../controllers/Bids');
// const { route } = require('./orderRoutes');
const router = express.Router();


router.post('/create', bidController.createBid);
router.get('/list', bidController.getAllBids);
router.get('/freelancer/:freelancerId', bidController.getFreelancerBids);
router.delete('/delete/:id', bidController.deleteBid);

module.exports = router;
