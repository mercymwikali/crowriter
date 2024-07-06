const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createFine = asyncHandler(async (req, res) => {
    const { orderId, freelancerId, amount, reason } = req.body;
  
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
  
    // Check if order is submitted
    const isSubmitted = await prisma.submittedJobs.findFirst({
      where: {
        orderId: orderId,
      },
    });
  
    if (!isSubmitted) {
      return res.status(400).json({ message: "Order is not submitted" });
    }

    //check if fine is already created
    const fine = await prisma.fines.findFirst({
      where: {
        orderId: orderId,
        freelancerId: freelancerId,
      },
    });
  
    if (fine) {
      return res.status(400).json({ message: "Order is already fined" });
    }
  
    try {
      // Create fine and notification within a transaction
      const result = await prisma.$transaction(async (tx) => {
        const fine = await tx.fines.create({
          data: {
            orderId,
            freelancerId,
            amount,
            reason,
          },
        });
  
        await tx.notification.create({
          data: {
            orderId,
            userId: freelancerId,
            title: `You have been fined`,
            message: `You have been fined ${amount} for ${reason}`,
            type: "FINE",
          },
        });
  
        return fine;
      });
  
      res.json({ message: `Freelancer has been fined`, fine: result });
    } catch (error) {
      console.log("Error creating fine:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  

const getFines = asyncHandler(async (req, res) => {
  try {
    const result = await prisma.fines.findMany({
      include: {
        order: true,
        freelancer: {
          select: {
            id: true,
            fname: true,
            lname: true,
          },
        },
      },
    });
    res.json(result);
  } catch (error) {
    console.log("Error getting fines:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateFine = asyncHandler(async (req, res) => {
  const { fineId } = req.params;
  const { amount, reason } = req.body;

  try {
    // Update fine and create a notification within a transaction
    const fine = await prisma.$transaction(async (tx) => {
      const updatedFine = await tx.fines.update({
        where: {
          id: fineId,
        },
        data: {
          amount,
          reason,
        },
      });

      await tx.notification.create({
        data: {
          orderId: updatedFine.orderId,
          userId: updatedFine.freelancerId,
          title: `Your fine has been updated`,
          message: `Your fine has been updated to ${amount} for ${reason}`,
          type: "FINE",
        },
      });

      return updatedFine;
    });

    res.json({ message: "Fine updated successfully", fine });
  } catch (error) {
    console.log("Error updating fine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteFine = asyncHandler(async (req, res) => {
  const { fineId } = req.params;

  try {
    // Delete fine and create a notification within a transaction
    const fine = await prisma.$transaction(async (tx) => {
      const deletedFine = await tx.fines.delete({
        where: {
          id: fineId,
        },
      });

      await tx.notification.create({
        data: {
          orderId: deletedFine.orderId,
          userId: deletedFine.freelancerId,
          title: `Your fine has been deleted`,
          message: `Your fine of ${deletedFine.amount} for ${deletedFine.reason} has been deleted`,
          type: "FINE",
        },
      });

      return deletedFine;
    });

    res.json({ message: "Fine deleted successfully", fine });
  } catch (error) {
    console.log("Error deleting fine:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getFinesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.fines.findMany({
      where: {  
        freelancerId: userId,
      },
      include: {
        order: true,
      },
    });
    res.json(result);
  } catch (error) {
    console.log("Error getting fines:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { createFine, getFines, updateFine, deleteFine, getFinesByUserId };
