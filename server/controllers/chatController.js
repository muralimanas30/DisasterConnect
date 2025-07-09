const chatService = require('../services/chatService');
const { CustomError } = require('../errorHandler/errorHandler');

const getIncidentChat = async (req, res, next) => {
    try {
        const messages = await chatService.getIncidentChat(req.params.incidentId);
        res.status(200).json({ status: 'success', messages });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to fetch chat messages.",
            error.statusCode || 500,
            error
        ));
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const message = await chatService.sendMessage(req.body, req.user);
        res.status(201).json({ status: 'success', message });
    } catch (error) {
        next(error instanceof CustomError ? error : new CustomError(
            error.message || "Failed to send message.",
            error.statusCode || 500,
            error
        ));
    }
};

module.exports = {
    getIncidentChat,
    sendMessage,
};
