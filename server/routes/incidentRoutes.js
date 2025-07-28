const express = require('express');
const incidentController = require('../controllers/incidentController');
const { validateCreateIncident } = require('../validators/incidentValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

// All endpoints require authentication
router.use(authMW);

// RESTful, minimal, non-redundant incident endpoints

// List all incidents / Create new incident
router.route('/')
    .get(incidentController.getIncidents) // GET /api/incidents
    .post(validateCreateIncident, incidentController.createIncident); // POST /api/incidents

// Get, update, delete a specific incident
router.route('/:incidentId')
    .get(incidentController.getIncidentById) // GET /api/incidents/:id
    .patch(incidentController.updateIncident) // PATCH /api/incidents/:id
    .delete(incidentController.deleteIncident); // DELETE /api/incidents/:id

// Assign volunteer to incident
router.post('/:incidentId/assign', incidentController.assignVolunteerToIncident); // POST /api/incidents/:id/assign

// Get incidents near the authenticated user's location
router.get('/nearby', incidentController.getNearbyIncidents); // GET /api/incidents/nearby

// Victims and volunteers for an incident
router.get('/:incidentId/victims', incidentController.listVictimsForIncident); // GET /api/incidents/:id/victims
router.get('/:incidentId/volunteers', incidentController.listVolunteersForIncident); // GET /api/incidents/:id/volunteers

// Reports for an incident (list, add)
router.route('/:incidentId/reports')
    .get(incidentController.getReportsForIncident) // GET /api/incidents/:id/reports
    .post(incidentController.addVictimReport);     // POST /api/incidents/:id/reports

// Accept a report for an incident (assign yourself to a report)
router.post('/:incidentId/reports/:reportIndex/accept', incidentController.acceptReport); // POST /api/incidents/:id/reports/:reportId/accept

// Update incident status
router.patch('/:incidentId/status', incidentController.updateIncidentStatus); // PATCH /api/incidents/:id/status

// Gathering invitation (if needed)
router.post('/:incidentId/gathering-invitation', incidentController.sendGatheringInvitation); // POST /api/incidents/:id/gathering-invitation

// Report a new incident (victim/volunteer)
router.post('/report', incidentController.reportIncident); // POST /api/incidents/report

// Add another victim to an existing incident
router.post('/:incidentId/add-victim', require('../controllers/incidentController').addVictimToIncident); // POST /api/incidents/:id/add-victim

// Get live locations of all victims and volunteers for a specific incident
router.get('/:incidentId/locations', require('../controllers/incidentController').getIncidentLocations); // GET /api/incidents/:incidentId/locations

module.exports = router;
