const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");
const auth = require("../middleware/auth"); // Assuming you'll have an auth middleware

// @route   POST /org/create
// @desc    Create a new organization and an admin user for it
// @access  Public (for initial setup)
router.post("/create", orgController.createOrganization);

// @route   GET /org/get/:name
// @desc    Get organization by name
// @access  Private (Admin only)
router.get("/get/:name", auth, orgController.getOrganizationByName);

// @route   PUT /org/update/:name
// @desc    Update organization by name
// @access  Private (Admin only)
router.put("/update/:name", auth, orgController.updateOrganizationByName);

// @route   DELETE /org/delete/:name
// @desc    Delete organization by name
// @access  Private (Admin only)
router.delete("/delete/:name", auth, orgController.deleteOrganizationByName);

module.exports = router;
