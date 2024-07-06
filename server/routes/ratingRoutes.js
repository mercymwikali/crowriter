const express = require("express");
const { createReview, editReview, deleteReview } = require("../controllers/ratingController");

const router = express.Router();

// Route to create a review and notify user
router.post("/create", createReview);

// Route to edit a review
router.patch("/edit/:reviewId", editReview);

// Route to delete a review
router.delete("/delete/:reviewId", deleteReview);

module.exports = router;
