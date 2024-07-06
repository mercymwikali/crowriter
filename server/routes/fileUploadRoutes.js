const express = require('express');
const router = express.Router();

router.post('/', submitJob);
router.get('/submissions', getSubmissions);
router.get('/submissions/freelancer/:freelancerId', getFreelancerSubmissions);
router.delete('/submissions/delete/:submissionId', deleteSubmission);
router.get('/submissions/download/:submissionId', downloadSubmission);

module.exports = router;
