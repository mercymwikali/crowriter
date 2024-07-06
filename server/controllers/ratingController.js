const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createReview = asyncHandler(async (req, res) => {
  const { orderId, reviewerId, freelancerId, rating, comment } = req.body;

  try {
    // Check if the order exists
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the reviewer exists
    const reviewer = await prisma.user.findUnique({
      where: {
        id: reviewerId,
      },
    });
    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found" });
    }

    // Check if the freelancer exists
    const freelancer = await prisma.user.findUnique({
      where: {
        id: freelancerId,
      },
    });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // Check if the reviewer has already reviewed the order
    const existingReview = await prisma.review.findFirst({
      where: {
        orderId,
        reviewerId,
      },
    });
    if (existingReview) {
      return res.status(400).json({ message: "Order has already been reviewed" });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId,
        freelancerId,
        rating,
        comment,
      },
    });

    // Notify the freelancer about the review
    await prisma.notification.create({
      data: {
        userId: freelancerId,
        orderId: orderId,
        title: "New Review Received",
        message: `You have received a new review with a rating of ${rating}.`,
        type: "REVIEW",
      },
    });

    res.json({ message: "Review created and user notified", review });
  } catch (error) {
    console.log("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const editReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const {  rating, comment } = req.body;

  try {
    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        rating,
        comment,
      },
    });

    res.json({ message: "Review updated", review: updatedReview });
  } catch (error) {
    console.log("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  try {
    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    res.json({ message: "Review deleted" });
  } catch (error) {
    console.log("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createReview,
  editReview,
  deleteReview,
};
