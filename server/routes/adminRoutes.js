const express = require('express');
const adminController = require('../controllers/adminController');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

// Only include routes for controller functions that are implemented and exported

// Comment out or remove routes for unimplemented adminController functions
// router.get('/users', adminController.listUsers);
// router.get('/incidents', adminController.listIncidents);
// router.get('/resources', adminController.listResources);
// router.get('/donations', adminController.listDonations);

// ...add more admin routes as you implement and verify them

module.exports = router;
