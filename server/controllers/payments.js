const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const prisma = new PrismaClient();

const postPayment = asyncHandler(async (req, res) => {
    const { amount, paymentRef, paymentDate, invoiceId, modeOfPayment, userId } = req.body;

    try {
        // // Check if the payment already exists
        // if (!invoiceNumber) {
        //     return res.status(400).json({ message: "Invoice number is required" });
        // }

        const paymentExists = await prisma.payment.findFirst({
            where: {
                paymentRef:paymentRef
            },
        });

        if (paymentExists) {
            return res.status(400).json({ message: "You have already paid for this invoice" });
        }

        const payment = await prisma.payment.create({
            data: {
                amount,
                paymentRef: paymentRef,
                //to isodate
               createdAt: new Date(paymentDate).toISOString(),
                invoiceId,
                modeOfPayment,
                userId,
            },
        });

        res.json(payment);
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const getPayment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                invoice: true,
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

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json(payment);
    } catch (error) {
        console.log("Error getting payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const writersPayment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const payments = await prisma.payment.findMany({
            where: {
                userId: id
            },
            include: {
                invoice: {
                    include: {
                        orders: {
                            include: {
                                fines: true,
                            },
                        },
                    },
                },
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
        res.json(payments);
    } catch (error) {
        console.log("Error getting payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


const getAllPayments = asyncHandler(async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                invoice: true,
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
        res.json(payments);
    } catch (error) {
        console.log("Error getting payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = {
    postPayment,
    getPayment,
    getAllPayments,
    writersPayment
};
