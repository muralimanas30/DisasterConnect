const express = require('express');
const chatController = require('../controllers/chatController');
const authMW = require('../middlewares/auth');
const router = express.Router();

router.use(authMW);

// Only include routes for controller functions that are implemented and exported

// If you have not implemented these functions, comment them out or remove them
// router.post('/room', chatController.createChatRoom);
// router.get('/room/:roomId', chatController.getChatRoom);
// router.get('/room/:roomId/messages', chatController.getRoomMessages);

// ...add more chat routes as you implement and verify them

module.exports = router;
