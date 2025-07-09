const Chat = require('../models/Chat');
const { CustomError } = require('../errorHandler/errorHandler');

const getIncidentChat = async (incidentId) => {
    // Fetch all messages for an incident, sorted by sentAt
    return await Chat.find({ incident: incidentId })
        .populate('sender', 'name email role')
        .sort({ sentAt: 1 });
};

const sendMessage = async (messageData, user) => {
    if (!messageData.incident || !messageData.message) {
        throw new CustomError('incident and message are required', 400);
    }
    const chat = new Chat({
        incident: messageData.incident,
        sender: user._id,
        message: messageData.message
    });
    await chat.save();
    return await chat.populate('sender', 'name email role');
};

module.exports = {
    getIncidentChat,
    sendMessage,
};
