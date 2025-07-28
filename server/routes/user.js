const express = require("express");
const router = express.Router();
const { getAssignedIncidentForUser } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

// GET /api/users/:userId/assigned-incident
router.get("/:userId/assigned-incident", auth, getAssignedIncidentForUser);

module.exports = router;