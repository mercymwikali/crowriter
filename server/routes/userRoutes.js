const express = require("express");
const router = express.Router();
const {
    getFreelancers,
    getFreelancerDetails,
    editProfile,
    getManagers,
    getManagerDetails,
    getUnapprovedFreelancers
} = require("../controllers/userContoller");

//

// Routes for freelancers
router.get("/freelancers", getFreelancers); // Fetch all freelancers
router.get("/freelancers/:id", getFreelancerDetails); // Fetch a specific freelancer by ID

//unapproved freelancers
router.get("/unapproved", getUnapprovedFreelancers);

// Route to edit a profile (excluding password)
router.patch("/profile/:id", editProfile); // Edit profile

// Routes for managers
router.get("/managers", getManagers); // Fetch all managers
router.get("/managers/:id", getManagerDetails); // Fetch a specific manager by ID

module.exports = router;
