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
      
      // Fetch the order or document details from your database
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
  
      // Set MIME type based on order.file_mimeType or fallback to octet-stream
      const mimeType = order.file_mimeType || 'application/octet-stream';
  
      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${documentId}"`);
      res.setHeader('Content-Type', mimeType);
  
      // Stream the file for download
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
