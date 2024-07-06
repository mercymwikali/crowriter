const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createBid = asyncHandler(async (req, res) => {
  try {
    const { orderId, freelancerId } = req.body;

    // Check if order exists and is pending
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // if (order.status !== "PENDING") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Order is not pending",
    //   });
    // }

    // Check if freelancer exists
    const freelancer = await prisma.user.findUnique({
      where: {
        id: freelancerId,
      },
    });
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    // Duplicate bid check using findFirst
    const existingBid = await prisma.bids.findFirst({
      where: {
        orderId: orderId,
        freelancerId: freelancerId,
      },
    });
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "Bid already exists",
      });
    }

    // Create bid
    const bid = await prisma.bids.create({
      data: {
        orderId,
        freelancerId,
      },
    });

    // Update order status to BIDDED if it's still PENDING
    if (order.status === "PENDING") {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "BIDDED",
        },
      });
    }

    res.status(201).json({
      success: true,
      data: bid,
      message: "Bid created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const getFreelancerBids = asyncHandler(async (req, res) => {
  try {
    const { freelancerId } = req.params;

    // Fetch bids for a specific freelancer
    const user = await prisma.user.findUnique({
      where: {
        id: freelancerId,
      },
    });
    const bids = await prisma.bids.findMany({
      where: {
        freelancerId: user.id,
      },
      include: {
        order: true,
      },
    });

    res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const getAllBids = asyncHandler(async (req, res) => {
  try {
    // Fetch all bids with order status "BIDDED"
    const bids = await prisma.bids.findMany({
      // where: {
      //   order: {
      //     status: "BIDDED",
      //   },
      // },
      include: {
        order: true,
        freelancer: {
          select: {
            id: true,
            fname: true,
            lname: true,
            profilePic: true,
            role: true,
            // rating: true,
            email: true,
          },
        }, // Include freelancer details
      },
    });

    if (!bids || bids.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bids found",
      });
    }

    /*
    * Calculate the number of bids for each order 
    * and add it to the bid object
    */
    const uniqueOrders = {};

    // Iterate over all bids to count bids for each order and track freelancer
    bids.forEach(bid => {
      const orderId = bid.order.id;
      // Check if the order already exists in uniqueOrders
      if (orderId in uniqueOrders) {
        // If yes, increment the count for that order
        uniqueOrders[orderId].bidCount++;
        // Track freelancer who bid on this order
        const freelancerInfo = {
          id: bid.freelancer.id,
          fname: bid.freelancer.fname,
          lname: bid.freelancer.lname,
          profilePic: bid.freelancer.profilePic,
          role: bid.freelancer.role,
          // rating: bid.freelancer.rating,
          email: bid.freelancer.email,
        };
        if (!uniqueOrders[orderId].freelancer.some(w => w.id === freelancerInfo.id)) {
          uniqueOrders[orderId].freelancer.push(freelancerInfo);
        }
      } else {
        // If not, add the order to uniqueOrders with count 1
        uniqueOrders[orderId] = {
          ...bid.order,
          bidCount: 1,
          freelancer: [{
            id: bid.freelancer.id,
            fname: bid.freelancer.fname,
            lname: bid.freelancer.lname,
            profilePic: bid.freelancer.profilePic,
            role: bid.freelancer.role,
            // rating: bid.freelancer.rating,
            email: bid.freelancer.email,
          }],
        };
      }
    });

    // Extract the values (unique orders) from uniqueOrders object
    const uniqueOrderList = Object.values(uniqueOrders);

    res.json(uniqueOrderList);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


const deleteBid = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Delete bid
    const deletedBid = await prisma.bids.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      success: true,
      data: deletedBid,
      message: "Bid deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = { createBid, getFreelancerBids, getAllBids, deleteBid };
