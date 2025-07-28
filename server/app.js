const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./errorHandler/errorHandler');
const routes = require('./routes');
const http = require('http');
const socketio = require('socket.io');
const Chat = require('./models/Chat');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Professional request logger middleware
app.use((req, res, next) => {
    const user = req.user ? `[user:${req.user._id}]` : '[user:anonymous]';
    const body = req.method !== 'GET' ? ` | body: ${JSON.stringify(req.body)}` : '';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${user}${body}`);
    next();
});

// Mount all API routes
app.use('/api', routes);

// Centralized error handler
app.use(errorHandler);

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket.io chat logic with enhanced logging
io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    socket.on('joinIncident', ({ incidentId, token }) => {
        socket.join(`incident_${incidentId}`);
        console.log(`[SOCKET] User joined incident room: ${incidentId} | socket: ${socket.id}`);
    });

    socket.on('sendMessage', async ({ incidentId, message, user }) => {
        if (!incidentId || !message || !user) {
            console.warn(`[SOCKET] Invalid sendMessage payload from socket: ${socket.id}`);
            return;
        }
        try {
            const chat = new Chat({
                incident: incidentId,
                sender: user._id,
                message
            });
            await chat.save();
            const populated = await chat.populate('sender', 'name email role');
            // FIX: emit to the correct room name
            io.to(`incident_${incidentId}`).emit('newMessage', {
                _id: populated._id,
                incident: populated.incident,
                sender: populated.sender,
                message: populated.message,
                sentAt: populated.sentAt
            });
            console.log(`[SOCKET] Message sent in incident ${incidentId} by user ${user._id}: "${message}"`);
        } catch (err) {
            console.error(`[SOCKET] Error saving chat: ${err.message}`);
        }
    });

    // Live location update event
    socket.on('updateLocation', ({ userId, incidentId, location, role }) => {
        console.log(`[SOCKET] Received location update from user ${userId} for incident ${incidentId}: ${JSON.stringify(location)}`);

        // Broadcast immediately to all users in the incident room
        io.to(`incident_${incidentId}`).emit('locationUpdate', {
            userId,
            name: location.name, // frontend should send name for immediate broadcast
            role,                // frontend should send role for immediate broadcast
            location,
        });
        console.log(`[SOCKET] Broadcasted locationUpdate for user ${userId} (${location.name}, ${role}) in incident ${incidentId}`);

        // Update user's location in DB asynchronously after 10 seconds
        setTimeout(async () => {
            try {
                const User = require('./models/User');
                await User.findByIdAndUpdate(userId, { currentLocation: location });
                console.log(`[SOCKET] Location saved to DB for user ${userId} (${location.name}) in incident ${incidentId}`);
            } catch (err) {
                console.error(`[SOCKET] Error saving location to DB: ${err.message}`);
            }
        }, 10000);
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] Client disconnected: ${socket.id}`);
    });
});

module.exports = { app, server };