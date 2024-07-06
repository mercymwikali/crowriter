const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer"); // Add this line to import multer
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/filesMulterSetup"); // Adjust the path as necessary

const createOrder = asyncHandler(async (req, res) => {
  try {
      const { freelancerId, ...orderData } = req.body;
      const attachment = req.file ? req.file.path : null;

      if (attachment) {
          orderData.attachments = attachment;
      }

      let order;
      if (freelancerId) {
          const freelancer = await prisma.user.findUnique({
              where: { id: freelancerId },
          });

          if (!freelancer) {
              return res.status(404).json({ success: false, message: 'Freelancer not found' });
          }

          const existingOrder = await prisma.order.findUnique({
              where: { orderId: orderData.orderId },
          });

          if (existingOrder) {
              return res.status(400).json({ success: false, message: 'Order already exists' });
          }

          order = await prisma.order.create({
              data: {
                  ...orderData,
                  freelancer: { connect: { id: freelancerId } },
              },
          });

          await prisma.notification.create({
              data: {
                  userId: freelancerId,
                  title: 'New Order Assigned',
                  message: `You have been assigned a new order with ID ${order.id}`,
                  type: 'ORDER',
              },
          });
      } else {
          order = await prisma.order.create({ data: orderData });
      }

      res.status(201).json({ success: true, data: order, message: 'Order created successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});


const getOrders = asyncHandler(async (req, res) => {
  try {
    const { freelancerId } = req.params; // Extract freelancerId from req.body

    // Fetch orders
    const orders = await prisma.order.findMany({
      where: {
        NOT
        : {
          freelancerId: {
            equals:freelancerId
          },
        },
      },
      include: {
        bids: true,
      },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Calculate the number of bids and unique freelancers for each order
    const ordersWithBidInfo = orders.map((order) => {
      const numBids = order.bids.length;
      const uniqueFreelancers = new Set(
        order.bids.map((bid) => bid.freelancerId)
      );
      const numFreelancers = uniqueFreelancers.size;
      return {
        ...order,
        numBids,
        numFreelancers,
      };
    });

    res.status(200).json(ordersWithBidInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  try {
      const { id } = req.params;
      const updateOrderData = req.body;
      const attachment = req.file ? req.file.path : null;

      if (attachment) {
          updateOrderData.attachments = attachment;
      }

      const order = await prisma.order.findUnique({ where: { id: id } });

      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.attachments && attachment) {
          fs.unlinkSync(order.attachments);
      }

      const updatedOrder = await prisma.order.update({
          where: { id: id },
          data: updateOrderData,
      });

      res.status(200).json({ success: true, data: updatedOrder, message: 'Order updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

const newOrdersList = asyncHandler(async (req, res) => {
  try {
    const newOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
      },
    });
    res.status(200).json(newOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({ where: { id: id } });

      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.freelancerId) {
          return res.status(400).json({ success: false, message: 'Order is assigned to a user' });
      }

      const confirmDelete = req.body.confirmDelete;
      if (!confirmDelete) {
          return res.status(400).json({ success: false, message: 'Deletion not confirmed' });
      }

      if (order.attachments) {
          fs.unlinkSync(order.attachments);
      }

      const deletedOrder = await prisma.order.delete({ where: { id: id } });

      if (deletedOrder.userId) {
          await prisma.notification.create({
              data: {
                  userId: deletedOrder.userId,
                  title: 'Order Deleted',
                  message: `Your order with ID ${deletedOrder.id} has been deleted.`,
                  type: 'ORDER',
              },
          });
      }

      res.status(200).json({ success: true, data: deletedOrder, message: 'Order deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  newOrdersList,
};
