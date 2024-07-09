const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all invoices with reviews and fines included
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        orders: {
          include: {
            reviews: true,
            fines: true,
          },
        },
        payments: true,
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
      },
    });
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single invoice with reviews and fines included
const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            reviews: true,
            fines: true,
          },
        },
        payments: true,
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new invoice
const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, userId, orders, payments, isDraft } = req.body;

    // Check if any of the orders are already linked to an existing invoice
    const existingInvoices = await prisma.invoice.findMany({
      where: {
        orders: {
          some: {
            orderId: {
              in: orders,
            },
          },
        },
      },
    });

    if (existingInvoices.length > 0) {
      const duplicateOrderIds = existingInvoices.flatMap((invoice) =>
        invoice.orders.map((order) => order.orderId)
      );

      return res.status(400).json({
        error: `The following orders are already linked to invoices: ${duplicateOrderIds.join(
          ", "
        )}`,
      });
    }

    // Proceed with checking eligibility for invoicing based on submission date as before
    const orderRecords = await prisma.order.findMany({
      where: {
        orderId: {
          in: orders,
        },
      },
      select: {
        id: true,
        amount: true,
        SubmittedJobs: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    const now = new Date();
    const eligibleOrders = orderRecords.filter((order) => {
      // Check if submission date is at least 2 weeks before now
      const submissionDate = new Date(order.SubmittedJobs.createdAt);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      return submissionDate <= twoWeeksAgo;
    });

    if (eligibleOrders.length !== orderRecords.length) {
      const notEligibleOrderIds = orderRecords
        .filter(
          (order) =>
            !eligibleOrders.some(
              (eligibleOrder) => eligibleOrder.id === order.id
            )
        )
        .map((order) => order.orderId);

      return res.status(400).json({
        error: `The following orders are not eligible for invoicing yet: ${notEligibleOrderIds.join(
          ", "
        )}`,
      });
    }

    const orderIds = orderRecords.map((order) => ({ id: order.id }));
    const totalAmount = orderRecords.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        userId,
        orders: {
          connect: orderIds,
        },
        payments: {
          create: payments,
        },
        totalAmount,
        isDraft,
      },
    });

    res.json({ message: "Invoice created successfully", data: invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update an invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceNumber, orders, payments } = req.body;

    const orderRecords = await prisma.order.findMany({
      where: {
        orderId: {
          in: orders,
        },
      },
      select: {
        id: true,
        amount: true,
      },
    });

    const totalAmount = orderRecords.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    // Calculate fines associated with orders
    const fineRecords = await prisma.fines.findMany({
      where: {
        orderId: {
          in: orders,
        },
      },
      select: {
        amount: true,
      },
    });

    const totalFines = fineRecords.reduce((sum, fine) => sum + fine.amount, 0);

    const finalAmount = totalAmount - totalFines;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        invoiceNumber,
        orders: {
          connect: orders.map((orderId) => ({ id: orderId })),
        },
        payments: {
          create: payments,
        },
        finalAmount,
      },
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.invoice.delete({
      where: { id },
    });
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
