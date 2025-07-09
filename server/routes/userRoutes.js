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
router.get('/incident-history', userController.getIncidentHistory);

module.exports = router;
