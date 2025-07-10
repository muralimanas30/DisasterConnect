const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes')); // <-- changed from /auth to /users
router.use('/incidents', require('./incidentRoutes'));
router.use('/volunteers', require('./volunteerRoutes'));
router.use('/chat', require('./chatRoutes'));
router.use('/resources', require('./resourceRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
