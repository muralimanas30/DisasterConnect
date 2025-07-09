const express = require('express');
const chatController = require('../controllers/chatController');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

// REST endpoints for chat history (optional, for fallback)
router.get('/incident/:incidentId', chatController.getIncidentChat);

module.exports = router;
router.post('/incident/:incidentId/message', (req, res, next) => {
    req.body.incident = req.params.incidentId;
    next();
}, chatController.sendMessage);

module.exports = router;
