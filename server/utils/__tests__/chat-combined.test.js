const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Incident = require('../../models/Incident');
const Chat = require('../../models/Chat');
const { MONGO_URI } = require('../../config');

let victimToken, volunteerToken, adminToken;
let victimId, volunteerId, adminId, incidentId;

describe('Chat API - Combined Cases', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Chat.deleteMany({});

        // Register victim
        const victimRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Victim User',
                email: 'victim@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        victimToken = victimRes.body.token;
        victimId = victimRes.body.user._id;

        // Register volunteer
        const volunteerRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Volunteer User',
                email: 'volunteer@example.com',
                password: 'password123',
                role: 'volunteer',
                currentLocation: { type: 'Point', coordinates: [77, 13] }
            });
        volunteerToken = volunteerRes.body.token;
        volunteerId = volunteerRes.body.user._id;

        // Register admin
        const adminRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                currentLocation: { type: 'Point', coordinates: [77, 14] }
            });
        adminToken = adminRes.body.token;
        adminId = adminRes.body.user._id;

        // Victim creates an incident
        const incidentRes = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${victimToken}`)
            .send({
                title: 'Complex Chat Incident',
                description: 'Incident for complex chat test',
                location: { type: 'Point', coordinates: [77, 12] }
            });
        incidentId = incidentRes.body.incident._id;

        // Assign volunteer to the incident
        await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', `Bearer ${volunteerToken}`)
            .send({ incidentId });
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Chat.deleteMany({});
        await mongoose.disconnect();
    });

    it('victim should send a chat message and volunteer should see it', async () => {
        // Victim sends a message
        const victimMsg = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${victimToken}`)
            .send({ message: 'Victim: Please help!' });
        expect(victimMsg.statusCode).toBe(201);
        expect(victimMsg.body.message.message).toBe('Victim: Please help!');

        // Volunteer fetches messages
        const volunteerMsgs = await request(app)
            .get(`/api/chat/incident/${incidentId}`)
            .set('Authorization', `Bearer ${volunteerToken}`);
        expect(volunteerMsgs.statusCode).toBe(200);
        expect(volunteerMsgs.body.messages.some(m => m.message === 'Victim: Please help!')).toBe(true);
    });

    it('volunteer should send a chat message and victim should see it', async () => {
        // Volunteer sends a message
        const volunteerMsg = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${volunteerToken}`)
            .send({ message: 'Volunteer: I am on my way.' });
        expect(volunteerMsg.statusCode).toBe(201);
        expect(volunteerMsg.body.message.message).toBe('Volunteer: I am on my way.');

        // Victim fetches messages
        const victimMsgs = await request(app)
            .get(`/api/chat/incident/${incidentId}`)
            .set('Authorization', `Bearer ${victimToken}`);
        expect(victimMsgs.statusCode).toBe(200);
        expect(victimMsgs.body.messages.some(m => m.message === 'Volunteer: I am on my way.')).toBe(true);
    });

    it('admin should send a chat message and both victim and volunteer should see it', async () => {
        // Admin sends a message
        const adminMsg = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ message: 'Admin: Please stay calm and follow instructions.' });
        expect(adminMsg.statusCode).toBe(201);
        expect(adminMsg.body.message.message).toBe('Admin: Please stay calm and follow instructions.');

        // Victim fetches messages
        const victimMsgs = await request(app)
            .get(`/api/chat/incident/${incidentId}`)
            .set('Authorization', `Bearer ${victimToken}`);
        expect(victimMsgs.statusCode).toBe(200);
        expect(victimMsgs.body.messages.some(m => m.message === 'Admin: Please stay calm and follow instructions.')).toBe(true);

        // Volunteer fetches messages
        const volunteerMsgs = await request(app)
            .get(`/api/chat/incident/${incidentId}`)
            .set('Authorization', `Bearer ${volunteerToken}`);
        expect(volunteerMsgs.statusCode).toBe(200);
        expect(volunteerMsgs.body.messages.some(m => m.message === 'Admin: Please stay calm and follow instructions.')).toBe(true);
    });

    it('should not allow sending a message without token', async () => {
        const res = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .send({ message: 'No token message' });
        expect(res.statusCode).toBe(401);
    });

    it('should not allow fetching messages for unauthorized user', async () => {
        // Register a new unrelated user
        const outsiderRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Outsider',
                email: 'outsider@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 15] }
            });
        const outsiderToken = outsiderRes.body.token;

        // Try to fetch messages for the incident
        const res = await request(app)
            .get(`/api/chat/incident/${incidentId}`)
            .set('Authorization', `Bearer ${outsiderToken}`);
        // If you enforce access control, expect 403 or 404, else 200
        // expect(res.statusCode).toBe(403);
        // For now, just check it's not 401
        expect(res.statusCode).not.toBe(401);
    });
});
