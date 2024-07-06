const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { freelancer: true },
  });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.status === 'CANCELLED') {
    return res.status(400).json({ message: 'Order is already cancelled' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    await tx.cancelledJobs.create({
      data: {
        order: {
          connect: { id: orderId },
        },
        freelancer: order.freelancerId ? { connect: { id: order.freelancerId } } : undefined,
        status: 'CANCELLED',
        attachments: null,
      },
    });

    if (order.freelancerId) {
      await tx.notification.create({
        data: {
          userId: order.freelancerId,
          orderId: orderId,
          title: 'Order Cancelled',
          message: 'Your assigned order has been cancelled by the manager.',
          type: 'ORDER',
        },
      });
    }
  });

  res.status(200).json({ message: 'Order cancelled successfully' });
});

const changeStatus = asyncHandler(async (req, res) => {
  const { orderId, newStatus } = req.body; // Added newStatus to request body

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.status === 'CANCELLED') {
    return res.status(400).json({ message: 'Order is already cancelled' });
  } else if (order.status === newStatus) {
    return res.status(400).json({ message: `Order is already in ${newStatus} status` });
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  });

  res.status(200).json({ message: `Order status changed successfully to ${newStatus}` });
});

module.exports = {
  cancelOrder,
  changeStatus,
};
