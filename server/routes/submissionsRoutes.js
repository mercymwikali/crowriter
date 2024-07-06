const express = require('express');
const router = express.Router();
const { submitJob, getSubmissions, getFreelancerSubmissions, deleteSubmission, downloadSubmission } = require('../controllers/submissionUpload'); // Adjust path based on your folder structure
const { uploadDocument, downloadFile } = require('../controllers/fileUploads'); // Assuming your controller name is fileUploads.js
const upload = require('../middleware/filesMulterSetup');

router.post('/submissionUploads', submitJob);
router.get('/submissions', getSubmissions);
router.get('/submissions/freelancer/:freelancerId', getFreelancerSubmissions);
router.delete('/submissions/delete/:submissionId', deleteSubmission);
router.get('/submissions/download/:submissionId', downloadSubmission);

router.post('/fileUploads', upload.single('file'), uploadDocument); // Assuming 'file' is the field name in your form
router.get('/downloadFile/:documentId', downloadFile); // Corrected route

module.exports = router;
