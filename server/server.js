const mongoose = require('mongoose');
const app = require('./app');
const { MONGO_URI, PORT } = require('./config');
const http = require('http');
const socketio = require('socket.io');

mongoose.connect(MONGO_URI)
    .then(() => {
        const server = http.createServer(app);
        const io = socketio(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        // Socket.io chat logic
        const Chat = require('./models/Chat');
        io.on('connection', (socket) => {
            socket.on('joinIncident', ({ incidentId, token }) => {
                socket.join(incidentId);
            });
            socket.on('sendMessage', async ({ incidentId, message, user }) => {
                if (!incidentId || !message || !user) return;
                const chat = new Chat({
                    incident: incidentId,
                    sender: user._id,
                    message
                });
                await chat.save();
                const populated = await chat.populate('sender', 'name email role');
                io.to(incidentId).emit('newMessage', {
                    _id: populated._id,
                    incident: populated.incident,
                    sender: populated.sender,
                    message: populated.message,
                    sentAt: populated.sentAt
                });
            });
        });

        server.listen(PORT, () => {
            console.log(`DRCP server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
