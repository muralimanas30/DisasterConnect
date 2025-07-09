jest.setTimeout(30000); // 30 seconds

const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const Incident = require('../../models/Incident');
const User = require('../../models/User');
const { MONGO_URI } = require('../../config');

let victim1Token, victim2Token, volunteer1Token, volunteer2Token;
let incidentId;

describe('Incident Coordination (Multiple Victims & Volunteers)', () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(MONGO_URI);
            console.log('Mongoose connected in test');
        } catch (err) {
            console.error('Mongoose connection error:', err);
            throw err;
        }

        // Reset database before all tests
        await Incident.deleteMany({});
        await User.deleteMany({});

        // Helper to register and login a user
        async function registerAndLogin(user) {
            let res = await request(app).post('/api/users/register').send(user);
            if (res.statusCode === 201 && res.body.token) {
                return res.body.token;
            }
            console.error('Registration failed:', res.body);
            throw new Error('Registration failed for ' + user.email);
        }

        victim1Token = await registerAndLogin({
            name: 'Victim One',
            email: 'victim1@example.com',
            password: 'password123',
            role: 'victim',
            currentLocation: { type: 'Point', coordinates: [77, 12] }
        });

        victim2Token = await registerAndLogin({
            name: 'Victim Two',
            email: 'victim2@example.com',
            password: 'password123',
            role: 'victim',
            currentLocation: { type: 'Point', coordinates: [77, 13] }
        });

        volunteer1Token = await registerAndLogin({
            name: 'Volunteer One',
            email: 'vol1@example.com',
            password: 'password123',
            role: 'volunteer',
            currentLocation: { type: 'Point', coordinates: [77, 14] }
        });

        volunteer2Token = await registerAndLogin({
            name: 'Volunteer Two',
            email: 'vol2@example.com',
            password: 'password123',
            role: 'volunteer',
            currentLocation: { type: 'Point', coordinates: [77, 15] }
        });
    });

    afterAll(async () => {
        // Reset database after all tests
        await Incident.deleteMany({});
        await User.deleteMany({});
        await mongoose.disconnect();
    });

    it('Victim 1 creates an incident (should have initial report)', async () => {
        const res = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${victim1Token}`)
            .send({
                title: 'Multi-victim Incident',
                description: 'Victim 1 initial report',
                location: { type: 'Point', coordinates: [77, 12] }
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.incident).toBeDefined();
        expect(res.body.incident.reports.length).toBe(1);
        incidentId = res.body.incident._id;
    });

    it('Victim 2 adds a report to the incident', async () => {
        const res = await request(app)
            .post(`/api/incidents/${incidentId}/reports`)
            .set('Authorization', `Bearer ${victim2Token}`)
            .send({ message: 'Victim 2 needs help!' });
        expect(res.statusCode).toBe(200);
        expect(res.body.report.message).toBe('Victim 2 needs help!');
    });

    it('Volunteer 1 assigns themselves to the incident', async () => {
        const res = await request(app)
            .post(`/api/incidents/${incidentId}/assign`)
            .set('Authorization', `Bearer ${volunteer1Token}`);
        expect(res.statusCode).toBe(200);
    });

    it('Volunteer 2 assigns themselves to the incident', async () => {
        const res = await request(app)
            .post(`/api/incidents/${incidentId}/assign`)
            .set('Authorization', `Bearer ${volunteer2Token}`);
        expect(res.statusCode).toBe(200);
    });

    it('Volunteer 1 accepts Victim 1\'s report', async () => {
        // Report index 0 is Victim 1's initial report
        const res = await request(app)
            .post(`/api/incidents/${incidentId}/reports/0/accept`)
            .set('Authorization', `Bearer ${volunteer1Token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.report.assignedVolunteers).toContainEqual(expect.any(String));
    });

    it('Volunteer 2 accepts Victim 2\'s report', async () => {
        // Report index 1 is Victim 2's report
        const res = await request(app)
            .post(`/api/incidents/${incidentId}/reports/1/accept`)
            .set('Authorization', `Bearer ${volunteer2Token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.report.assignedVolunteers).toContainEqual(expect.any(String));
    });

    it('Both volunteers can see all reports for the incident', async () => {
        const res = await request(app)
            .get(`/api/incidents/${incidentId}/reports`)
            .set('Authorization', `Bearer ${volunteer1Token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.reports.length).toBeGreaterThanOrEqual(2);
    });

    it('Incident status can be resolved after all victims are satisfied', async () => {
        const res = await request(app)
            .patch(`/api/incidents/${incidentId}/status`)
            .set('Authorization', `Bearer ${volunteer1Token}`)
            .send({ status: 'resolved' });
        expect(res.statusCode).toBe(200);
        expect(res.body.incident.status).toBe('resolved');
    });
});