const express = require('express');
const incidentController = require('../controllers/incidentController');
const { validateCreateIncident } = require('../validators/incidentValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

// CRUD
router.get('/', incidentController.getIncidents); // List all incidents
router.post('/', validateCreateIncident, incidentController.createIncident); // Create a new incident
router.post('/report', validateCreateIncident, incidentController.reportIncident); // Victim reports a new incident (with themselves as a victim)
router.get('/nearby', incidentController.getNearbyIncidents); // Get incidents near the authenticated user's location
router.patch('/:incidentId/status', incidentController.updateIncidentStatus); // Update the status (open, in_progress, resolved) of a specific incident
router.post('/:incidentId/victim-report', incidentController.addVictimReport); // Add a new victim report to an existing incident
router.post('/:incidentId/gathering-invitation', incidentController.sendGatheringInvitation); // Send a gathering invitation for an incident

// Incident details, update, delete
router.get('/:incidentId', incidentController.getIncidentById); // Get details of a specific incident
router.patch('/:incidentId', incidentController.updateIncident); // Update details of a specific incident
router.delete('/:incidentId', incidentController.deleteIncident); // Delete a specific incident

// Assign volunteer to incident
router.post('/:incidentId/assign-volunteer', incidentController.assignVolunteerToIncident); // Assign a volunteer to an incident

// List victims/volunteers for an incident
router.get('/:incidentId/victims', incidentController.listVictimsForIncident); // List all victims for a specific incident
router.get('/:incidentId/volunteers', incidentController.listVolunteersForIncident); // List all volunteers (with live location/status) for a specific incident

// Volunteer Accepts a Report
router.post('/:incidentId/reports/:reportIndex/accept', incidentController.acceptReport); // Volunteer accepts a specific report for an incident (assigns themselves to that report)
module.exports = router;
