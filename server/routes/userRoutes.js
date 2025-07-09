const express = require('express');
const userController = require('../controllers/userController');
const { validateRegister, validateLogin } = require('../validators/userValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

// Auth
router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);

// All routes below require authentication
router.use(authMW);

// Victim actions
router.post('/accept-invitation', userController.acceptGatheringInvitation);
router.get('/incident-history', userController.getIncidentHistory);

// User profile
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/all', userController.listUsers);
router.delete('/:userId', userController.deleteUser); // admin delete


module.exports = router;
