const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

// Assign self to an incident (expects { incidentId } in body)
router.post('/assign', volunteerController.assignToIncident);

// List incidents assigned to this volunteer
router.get('/assigned-incidents', volunteerController.getAssignedIncidents);

// ...add more clean, self-service volunteer endpoints as needed

module.exports = router;
