const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Incident = require('../../models/Incident');
const User = require('../../models/User');
const { MONGO_URI } = require('../../config');

let token;
let userId;
let incidentId;

describe('Incident API', () => {
    beforeAll(async () => {
        // Connect to DB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Clean up
        await Incident.deleteMany({});
        await User.deleteMany({});

        // Register and login a user to get a token
        const registerRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'incidentuser',
                email: 'incidentuser@example.com',
                password: 'password123',
                role: 'victim',
                location: { type: 'Point', coordinates: [77, 12] }
            });

        // Defensive: If registration returns token, use it, else login
        if (registerRes.body && registerRes.body.token) {
            token = registerRes.body.token;
            userId = registerRes.body.user._id;
        } else {
            const loginRes = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'incidentuser@example.com',
                    password: 'password123'
                });
            token = loginRes.body.token;
            userId = loginRes.body.user._id;
        }
        // Log for debug
        // console.log(token + " token received from back");
    });

    afterAll(async () => {
        await Incident.deleteMany({});
        await User.deleteMany({});
        await mongoose.disconnect();
    });

    it('should create a new incident', async () => {
        const res = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Flood',
                description: 'Heavy flood in area',
                status: 'open',
                location: { type: 'Point', coordinates: [77, 12] }
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('incident');
        incidentId = res.body.incident._id;
    });

    it('should not create incident with missing fields', async () => {
        const res = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Incomplete Incident'
                // missing location, status, etc.
            });
        expect(res.statusCode).toBe(400);
    });

    it('should get all incidents', async () => {
        const res = await request(app)
            .get('/api/incidents')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('incidents');
        expect(Array.isArray(res.body.incidents)).toBe(true);
    });

    it('should get incident details by id', async () => {
        const res = await request(app)
            .get(`/api/incidents/${incidentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('incident');
        expect(res.body.incident._id).toBe(incidentId);
    });

    it('should update an incident', async () => {
        const res = await request(app)
            .patch(`/api/incidents/${incidentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Updated description' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('incident');
        expect(res.body.incident.description).toBe('Updated description');
    });

    it('should fail to update a non-existent incident', async () => {
        const res = await request(app)
            .patch(`/api/incidents/000000000000000000000000`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Should not work' });
        expect(res.statusCode).toBe(404);
    });

    it('should add a victim report to an incident', async () => {
        const res = await request(app)
            .post(`/api/incidents/${incidentId}/victim-report`)
            .set('Authorization', `Bearer ${token}`)
            .send({ message: 'Need urgent help!' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('report');
        expect(res.body.report.message).toBe('Need urgent help!');
    });

    it('should fail to add a victim report to a non-existent incident', async () => {
        const res = await request(app)
            .post(`/api/incidents/000000000000000000000000/victim-report`)
            .set('Authorization', `Bearer ${token}`)
            .send({ message: 'This should fail' });
        expect(res.statusCode).toBe(404);
    });

    it('should get volunteers for an incident (should be empty array)', async () => {
        const res = await request(app)
            .get(`/api/incidents/${incidentId}/volunteers`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('volunteers');
        expect(Array.isArray(res.body.volunteers)).toBe(true);
    });

    it('should update incident status', async () => {
        const res = await request(app)
            .patch(`/api/incidents/${incidentId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'in_progress' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('incident');
        expect(res.body.incident.status).toBe('in_progress');
    });

    it('should fail to update status for non-existent incident', async () => {
        const res = await request(app)
            .patch(`/api/incidents/000000000000000000000000/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'resolved' });
        expect(res.statusCode).toBe(404);
    });

    it('should delete an incident', async () => {
        const res = await request(app)
            .delete(`/api/incidents/${incidentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect([200, 204, 202]).toContain(res.statusCode);
    });

    it('should fail to get deleted incident', async () => {
        const res = await request(app)
            .get(`/api/incidents/${incidentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // Edge case: Unauthorized access
    it('should fail without token', async () => {
        const res = await request(app)
            .get('/api/incidents');
        expect(res.statusCode).toBe(401);
    });

    // Edge case: Invalid token
    it('should fail with invalid token', async () => {
        const res = await request(app)
            .get('/api/incidents')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toBe(401);
    });
});
