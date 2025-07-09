const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const { validateProfile } = require('../validators/volunteerValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

// Only include routes for controller functions that are implemented and working

router.get('/', volunteerController.getVolunteers);
router.post('/assign', volunteerController.assignVolunteer);
router.patch('/location', validateProfile, volunteerController.updateVolunteerLocation);
router.post('/mark-reached', volunteerController.markVolunteerReached);
router.get('/assigned-incidents', volunteerController.getAssignedIncidents);

// Remove/comment out routes for unimplemented or buggy features
// router.get('/profile', volunteerController.getProfile);
// router.patch('/profile', volunteerController.updateProfile);
// router.get('/tasks', volunteerController.getTasks);
// router.post('/tasks/:taskId/accept', volunteerController.acceptTask);
// router.post('/tasks/:taskId/complete', volunteerController.completeTask);

module.exports = router;
