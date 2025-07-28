const express = require('express');
const userController = require('../controllers/userController');
const { validateRegister, validateLogin } = require('../validators/userValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

// Registration and login
router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);

// All routes below require authentication
router.use(authMW);

// User profile (common for all roles)
router.route('/profile')
    .get(userController.getProfile)
    .patch(userController.updateProfile);

// Victim/volunteer actions (if needed)
router.post('/accept-invitation', userController.acceptGatheringInvitation);

// Incident history for the authenticated user
router.get('/incident-history', authMW, userController.getIncidentHistory);

// Incident history for a specific user (admin or self)
router.get('/:userId/incident-history', authMW, async (req, res, next) => {
    try {
        // Only allow self or admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const history = await require('../services/userService').getIncidentHistory(req.params.userId);
        res.json({ status: 'success', history });
    } catch (error) {
        res.status(error.statusCode || 404).json({ error: error.message });
    }
});

// Get assigned incident for a user (volunteer or victim)
router.get('/:userId/assigned-incident', authMW, userController.getAssignedIncident);

module.exports = router;
