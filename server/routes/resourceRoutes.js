const express = require('express');
const resourceController = require('../controllers/resourceController');
const { validateResource, validateAllocate, validateBulkAllocate } = require('../validators/resourceValidator');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

router.post('/donate', validateResource, resourceController.donate);
router.get('/', resourceController.getResources);
router.post('/allocate', validateAllocate, resourceController.allocateResource);
router.post('/allocate/bulk', validateBulkAllocate, resourceController.bulkAllocateResources);
router.get('/history', resourceController.getDonationHistory);
router.get('/:resourceId', resourceController.getResourceById);

// ...add more resource routes as needed

module.exports = router;
