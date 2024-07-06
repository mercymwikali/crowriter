const asyncHandler = require("express-async-handler");
const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

const assignOrder = asyncHandler(async (req, res) => {
  const { orderId, freelancerId } = req.body;

  if (!orderId || !freelancerId) {
    return res.status(400).json({ message: "Both orderId and freelancerId are required" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.freelancerId) {
      return res.status(400).json({ message: "Order is already assigned to a user" });
    }

    const freelancer = await prisma.user.findUnique({
      where: { id: freelancerId },
    });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { freelancerId, status: "ASSIGNED" },
      });

      await tx.assignment.create({
        data: {
          order: { connect: { id: orderId } },
          freelancer: { connect: { id: freelancerId } },
        },
      });

      await tx.notification.create({
        data: {
          userId: freelancerId,
          title: "Order assigned",
          message: "You have been assigned to a new order",
          orderId: order.id,
          type: "ORDER",
        },
      });
    });

    res.status(200).json({ message: "Order assigned successfully" });
  } catch (error) {
    console.error("Error assigning order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Database operation failed" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

const getAssignedOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await prisma.assignment.findMany({
      where: {
        order: {
          status: "ASSIGNED",
        },
      },
      include: {
        order: {
          select: {
            id: true,
            orderId: true,
            topic: true,
            service: true,
            amount: true,
            status: true,
            deadline: true,
            duration: true,
            attachments: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            fname: true,
            lname: true,
            profilePic: true,
            role: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const deletedAssignment = await prisma.assignment.delete({
      where: {
        id: assignmentId,
      },
    });

    const notificationMessage = "Your order has been cancelled.";

    await prisma.notification.create({
      data: {
        userId: deletedAssignment.freelancerId,
        title: "Order cancelled",
        message: notificationMessage,
        orderId: deletedAssignment.orderId,
        type: "ORDER",
      },
    });

    await prisma.order.update({
      where: {
        id: deletedAssignment.orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getAssignedOrdersByFreelancer = asyncHandler(async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const orders = await prisma.assignment.findMany({
      where: {
        freelancerId: freelancerId,
      },
      include: {
        order: true,
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const extendDeadline = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { newDeadline, message } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { deadline: newDeadline },
    });

    await prisma.notification.create({
      data: {
        userId: updatedOrder.freelancerId,
        title: "Deadline extended",
        message: message,
        orderId: updatedOrder.id,
        type: "OTHER",
      },
    });

    res.status(200).json({ message: "Deadline extended successfully" });
  } catch (error) {
    console.error("Error extending deadline:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const reassignOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { newFreelancerId } = req.body;

  try {
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { freelancer: true },
    });

    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldFreelancerId = currentOrder.freelancerId;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { freelancerId: newFreelancerId },
    });

    if (oldFreelancerId) {
      await prisma.notification.create({
        data: {
          userId: oldFreelancerId,
          title: "Order reassigned",
          message: "Your order has been reassigned.",
          orderId: updatedOrder.id,
          type: "ORDER",
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: newFreelancerId,
        title: "Order assigned",
        message: "You have been assigned a new order",
        orderId: updatedOrder.id,
        type: "ORDER",
      },
    });

    res.status(200).json({ message: "Order reassigned successfully" });
  } catch (error) {
    console.error("Error reassigning order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = {
  assignOrder,
  getAssignedOrders,
  deleteAssignment,
  getAssignedOrdersByFreelancer,
  extendDeadline,
  reassignOrder,
};
