const express = require("express");
const { getAllIncidents,createIncident,updateIncident,deleteAllIncidents } = require("../controllers/incident.controller");

const router = express.Router();

// Route to get all incidents
router.get("/", getAllIncidents)
    .post("/", createIncident)
    .delete("/", deleteAllIncidents)
    .put("/:id", updateIncident)

module.exports = router;