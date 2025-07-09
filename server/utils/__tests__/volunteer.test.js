const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Incident = require('../../models/Incident');
const Volunteer = require('../../models/Volunteer');
const { MONGO_URI } = require('../../config');

let volunteerToken, volunteerId, incidentId;

jest.setTimeout(30000); // 30 seconds

describe('Volunteer API', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Volunteer.deleteMany({});

        // Register and login a volunteer
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'volunteer1',
                email: 'volunteer1@example.com',
                password: 'password123',
                role: 'volunteer',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        volunteerToken = res.body.token;
        volunteerId = res.body.user._id;

        // Register and login a victim to create an incident
        const victimRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'victim1',
                email: 'victim1@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 13] }
            });
        const victimToken = victimRes.body.token;

        // Create an incident as victim
        const incidentRes = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${victimToken}`)
            .send({
                title: 'Test Incident',
                description: 'Incident for volunteer assignment',
                location: { type: 'Point', coordinates: [77, 13] }
            });
        incidentId = incidentRes.body.incident._id;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Volunteer.deleteMany({});
        await mongoose.disconnect();
    });

    it('should login as volunteer', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'volunteer1@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.role).toBe('volunteer');
    });

    it('should assign volunteer to an incident', async () => {
        const res = await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', `Bearer ${volunteerToken}`)
            .send({ incidentId });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('assigned', true);
    });

    it('should not assign volunteer to another unresolved incident', async () => {
        // Create another incident
        const victimRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'victim2',
                email: 'victim2@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 14] }
            });
        const victimToken = victimRes.body.token;
        const incidentRes = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${victimToken}`)
            .send({
                title: 'Another Incident',
                description: 'Should not allow assignment',
                location: { type: 'Point', coordinates: [77, 14] }
            });
        const newIncidentId = incidentRes.body.incident._id;

        // Try to assign to new incident
        const res = await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', `Bearer ${volunteerToken}`)
            .send({ incidentId: newIncidentId });
        expect(res.statusCode).toBe(400);
    });

    it('should get assigned incidents for volunteer', async () => {
        const res = await request(app)
            .get('/api/volunteers/assigned-incidents')
            .set('Authorization', `Bearer ${volunteerToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.incidents)).toBe(true);
        expect(res.body.incidents.length).toBe(1);
        expect(res.body.incidents[0]._id).toBe(incidentId);
    });

    it('should update volunteer status', async () => {
        const res = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${volunteerToken}`)
            .send({ status: 'busy' });
        expect(res.statusCode).toBe(200);
        // Log the returned user object for debugging
        console.log('Returned user after status update:', res.body.user);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.status).toBe('busy');
    });

    it('should update volunteer location', async () => {
        const res = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${volunteerToken}`)
            .send({ currentLocation: { type: 'Point', coordinates: [78, 15] } });
        expect(res.statusCode).toBe(200);
        // Defensive: check if user/currentLocation exists before asserting
        expect(res.body.user).toBeDefined();
        expect(res.body.user.currentLocation).toBeDefined();
        expect(res.body.user.currentLocation.coordinates).toEqual([78, 15]);
    });

    it('should not allow assignment without token', async () => {
        const res = await request(app)
            .post('/api/volunteers/assign')
            .send({ incidentId });
        expect(res.statusCode).toBe(401);
    });

    it('should not allow assignment with invalid token', async () => {
        const res = await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', 'Bearer invalidtoken')
            .send({ incidentId });
        expect(res.statusCode).toBe(401);
    });

    // ...add more edge cases as needed
});
