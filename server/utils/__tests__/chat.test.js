const request = require('supertest');
const { app } = require('../../app'); // <-- Use only the Express app, not the server
const mongoose = require('mongoose');
const User = require('../../models/User');
const Incident = require('../../models/Incident');
const Chat = require('../../models/Chat');
const { MONGO_URI } = require('../../config');

let token, userId, incidentId;

describe('Chat API', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Chat.deleteMany({});

        // Register and login a user
        const registerRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'chatuser',
                email: 'chatuser@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        token = registerRes.body.token;
        userId = registerRes.body.user._id;

        // Create an incident
        const incidentRes = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Chat Incident',
                description: 'For chat testing',
                location: { type: 'Point', coordinates: [77, 12] }
            });
        incidentId = incidentRes.body.incident._id;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Chat.deleteMany({});
        await mongoose.disconnect();
    });

    it('should send a chat message', async () => {
        const res = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${token}`)
            .send({ message: 'Hello, this is a test message.' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message.message).toBe('Hello, this is a test message.');
        expect(res.body.message.incident).toBe(incidentId);
    });

    it('should get all chat messages for an incident', async () => {
        const res = await request(app)
            .get(`/api/chat/incident/${incidentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('messages');
        expect(Array.isArray(res.body.messages)).toBe(true);
        expect(res.body.messages.length).toBeGreaterThan(0);
    });

    // Edge case: Unauthorized access
    it('should fail to get messages without token', async () => {
        const res = await request(app)
            .get(`/api/chat/incident/${incidentId}`);
        expect(res.statusCode).toBe(401);
    });
});

// Note: Socket.io tests require a client and are best tested with integration/e2e tools.
// Keep REST tests for chat history as fallback.
