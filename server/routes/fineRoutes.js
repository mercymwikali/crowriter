const express = require("express");
const {
  createFine,
  getFines,
  updateFine,
  deleteFine,
  getFinesByUserId,
} = require("../controllers/finesController"); // Adjust the path according to your project structure

const router = express.Router();

// Route to create a new fine
router.post("/create", createFine);

// Route to get all fines
router.get("/list", getFines);

// Route to update a fine by its ID
router.patch("/update/:fineId", updateFine);

// Route to delete a fine by its ID
router.delete("/delete/:fineId", deleteFine);

// Route to get fines by user ID
router.get("/user/:userId", getFinesByUserId);

module.exports = router;
