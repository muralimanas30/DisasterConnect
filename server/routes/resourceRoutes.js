const express = require('express');
const resourceController = require('../controllers/resourceController');
const { validateDonate, validateAllocate, validateBulkAllocate } = require('../validators/resourceValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

router.post('/donate', validateDonate, resourceController.donate);
// router.post('/donate-money', resourceController.donateMoney); // <-- Comment out Razorpay route
router.get('/', resourceController.getResources);
router.get('/history', resourceController.getDonationHistory);
router.get('/:resourceId', resourceController.getResourceById);
router.post('/allocate', validateAllocate, resourceController.allocateResource);
router.post('/bulk-allocate', validateBulkAllocate, resourceController.bulkAllocateResources);

// ...add more resource routes as needed

module.exports = router;
