const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./errorHandler/errorHandler');
const routes = require('./routes');
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const http = require('http');
const socketio = require('socket.io');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB (ensure connection before routes)
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Mount all API routes
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Centralized error handler
app.use(errorHandler);

// Socket.io setup
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket.io chat logic
const Chat = require('./models/Chat');
const { verifyJWT } = require('./middlewares/auth'); // You may need to export a JWT verify function

io.on('connection', (socket) => {
    // Join incident room
    socket.on('joinIncident', ({ incidentId, token }) => {
        // Optionally verify JWT here for security
        socket.join(incidentId);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ incidentId, message, user }) => {
        if (!incidentId || !message || !user) return;
        // Save to DB
        const chat = new Chat({
            incident: incidentId,
            sender: user._id,
            message
        });
        await chat.save();
        const populated = await chat.populate('sender', 'name email role');
        // Emit to all in room
        io.to(incidentId).emit('newMessage', {
            _id: populated._id,
            incident: populated.incident,
            sender: populated.sender,
            message: populated.message,
            sentAt: populated.sentAt
        });
    });
});

module.exports = { app, server }; // Export both for use in server.js
