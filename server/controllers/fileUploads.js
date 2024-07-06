const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const prisma = new PrismaClient();

const uploadDocument = asyncHandler(async (req, res) => {
    try {
        const { filename } = req.file; // Assuming multer has added 'filename' to req.file
        if (!filename) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extracting the document id from the filename
        const documentId = filename; // You might need to parse or manipulate the filename to get the document ID

        // Send the document id back to the client
        console.log('Document ID:', documentId);
        res.status(200).json({ success: true, message: 'Document uploaded successfully', documentId, filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const downloadFile = asyncHandler(async (req, res) => {
    try {
        const { documentId } = req.params;
        const order = await prisma.order.findFirst({
            where: {
                attachments: {
                    has: documentId, // Check if the array contains the documentId
                },
            },
        });
        if (!order) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Construct the file path using the correct directory
        const filePath = path.join(__dirname, '../uploads/fileUploads', documentId);
        const fileName = path.basename(filePath);

        // Set a fallback MIME type if order.file_mimeType is not defined
        const mimeType = order.file_mimeType || 'application/octet-stream';

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', mimeType);

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to download file. Please try again later.' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = {
    uploadDocument,
    downloadFile
};
