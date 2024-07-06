const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer"); // Add this line to import multer
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/multerSetup"); // Adjust the path as necessary

const submitJob = async (req, res) => {upload.single("file")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ error: err.message });
    }

    try {
      const { orderId, freelancerId } = req.body;

      if (!orderId || !freelancerId) {
        return res
          .status(400)
          .json({ error: "Order ID and Freelancer ID are required." });
      }

      console.log(orderId, freelancerId);

      // Check if the orderId exists
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found." });
      }

      // Check if the freelancerId exists
      const freelancer = await prisma.user.findUnique({
        where: { id: freelancerId },
      });

      if (!freelancer) {
        return res.status(404).json({ error: "Freelancer not found." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const submission = await prisma.submittedJobs.create({
        data: {
          orderId: orderId,
          freelancerId: freelancerId,
          file_Path: req.file.path,
          file_mimeType: req.file.mimetype,
        },
      });

      res.status(200).json(submission);
    } catch (error) {
      console.error("Error uploading file:", error);
      res
        .status(500)
        .json({ error: "Failed to upload file. Please try again later." });
    }
  });
};

const getSubmissions = async (req, res) => {
  try {
    const submissions = await prisma.submittedJobs.findMany({
      include: {
        order: {
          select: {
            orderId: true,
            topic: true,
            amount: true,
            deadline: true,
            duration: true,
            status: true,
            createdAt: true,
          },
        },
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
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      skip: 0,
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch submissions. Please try again later." });
  }
};

const getFreelancerSubmissions = async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const submissions = await prisma.submittedJobs.findMany({
      where: { freelancerId: freelancerId },
      include: {
        order: {
          select: {
            orderId: true,
            topic: true,
            amount: true,
            deadline: true,
            duration: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching freelancer submissions:", error);
    res
      .status(500)
      .json({
        error:
          "Failed to fetch freelancer submissions. Please try again later.",
      });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await prisma.submittedJobs.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    fs.unlinkSync(path.join(__dirname, "../", submission.file_Path)); // Delete the file from the server

    await prisma.submittedJobs.delete({
      where: { id: submissionId },
    });

    res.status(200).json({ message: "Submission deleted successfully." });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res
      .status(500)
      .json({ error: "Failed to delete submission. Please try again later." });
  }
};

const downloadSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = await prisma.submittedJobs.findUnique({
            where: { id: submissionId },
        });

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found.' });
        }

        const filePath = path.join(__dirname, '../', submission.file_Path);
        const fileName = path.basename(filePath);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', submission.file_mimeType);

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to download file. Please try again later.' });
                }
            }
        });
    } catch (error) {
        console.error('Error downloading submission:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to download submission. Please try again later.' });
        }
    }
};

module.exports = {
  submitJob,
  getSubmissions,
  getFreelancerSubmissions,
  deleteSubmission,
  downloadSubmission,
};
