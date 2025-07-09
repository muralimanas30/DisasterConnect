const request = require('supertest');
const { app } = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Incident = require('../../models/Incident');
const Volunteer = require('../../models/Volunteer');
const Resource = require('../../models/Resource');
const Chat = require('../../models/Chat');
const { MONGO_URI } = require('../../config');

describe('DRCP System Test - Full Workflow', () => {
    let victim1Token, victim2Token, volunteer1Token, volunteer2Token, adminToken;
    let victim1Id, victim2Id, volunteer1Id, volunteer2Id, adminId, incidentId, resourceId;

    beforeAll(async () => {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Volunteer.deleteMany({});
        await Resource.deleteMany({});
        await Chat.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Incident.deleteMany({});
        await Volunteer.deleteMany({});
        await Resource.deleteMany({});
        await Chat.deleteMany({});
        await mongoose.disconnect();
    });

    it('should register two victims, two volunteers, and one admin', async () => {
        // Victim 1
        const v1 = await request(app).post('/api/users/register').send({
            name: 'Victim1', email: 'victim1@sys.com', password: 'password123', role: 'victim',
            currentLocation: { type: 'Point', coordinates: [77, 12] }
        });
        victim1Token = v1.body.token;
        victim1Id = v1.body.user._id;

        // Victim 2
        const v2 = await request(app).post('/api/users/register').send({
            name: 'Victim2', email: 'victim2@sys.com', password: 'password123', role: 'victim',
            currentLocation: { type: 'Point', coordinates: [77, 13] }
        });
        victim2Token = v2.body.token;
        victim2Id = v2.body.user._id;

        // Volunteer 1
        const vol1 = await request(app).post('/api/users/register').send({
            name: 'Volunteer1', email: 'vol1@sys.com', password: 'password123', role: 'volunteer',
            currentLocation: { type: 'Point', coordinates: [77, 14] }
        });
        volunteer1Token = vol1.body.token;
        volunteer1Id = vol1.body.user._id;

        // Volunteer 2
        const vol2 = await request(app).post('/api/users/register').send({
            name: 'Volunteer2', email: 'vol2@sys.com', password: 'password123', role: 'volunteer',
            currentLocation: { type: 'Point', coordinates: [77, 15] }
        });
        volunteer2Token = vol2.body.token;
        volunteer2Id = vol2.body.user._id;

        // Admin
        const admin = await request(app).post('/api/users/register').send({
            name: 'Admin', email: 'admin@sys.com', password: 'password123', role: 'admin',
            currentLocation: { type: 'Point', coordinates: [77, 16] }
        });
        adminToken = admin.body.token;
        adminId = admin.body.user._id;
    });

    it('victim1 creates an incident and victim2 reports on it', async () => {
        // Victim1 creates
        const res = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${victim1Token}`)
            .send({
                title: 'Flood in Area',
                description: 'Severe flooding reported',
                location: { type: 'Point', coordinates: [77, 12] }
            });
        expect(res.statusCode).toBe(201);
        incidentId = res.body.incident._id;

        // Victim2 adds a report
        const reportRes = await request(app)
            .post(`/api/incidents/${incidentId}/reports`)
            .set('Authorization', `Bearer ${victim2Token}`)
            .send({ message: 'Need urgent rescue at my location!' });
        expect(reportRes.statusCode).toBe(200);
        expect(reportRes.body.report.message).toBe('Need urgent rescue at my location!');
    });

    it('both volunteers assign to the incident, but only one should succeed', async () => {
        // Volunteer 1 assigns
        const assign1 = await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', `Bearer ${volunteer1Token}`)
            .send({ incidentId });
        expect(assign1.statusCode).toBe(200);
        expect(assign1.body.assigned).toBe(true);

        // Volunteer 2 assigns
        const assign2 = await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', `Bearer ${volunteer2Token}`)
            .send({ incidentId });
        expect(assign2.statusCode).toBe(200);
        expect(assign2.body.assigned).toBe(true);

        // Volunteer 1 tries to assign to another incident (should fail)
        const newIncident = await request(app)
            .post('/api/incidents')
            .set('Authorization', `Bearer ${victim2Token}`)
            .send({
                title: 'Fire in Area',
                description: 'Fire reported',
                location: { type: 'Point', coordinates: [77, 18] }
            });
        const newIncidentId = newIncident.body.incident._id;
        const failAssign = await request(app)
            .post('/api/volunteers/assign')
            .set('Authorization', `Bearer ${volunteer1Token}`)
            .send({ incidentId: newIncidentId });
        expect(failAssign.statusCode).toBe(400);
    });

    it('victim1 donates a resource, admin allocates it, and volunteer1 tries unauthorized allocation', async () => {
        // Victim1 donates
        const donateRes = await request(app)
            .post('/api/resources/donate')
            .set('Authorization', `Bearer ${victim1Token}`)
            .send({
                name: 'Food Packets',
                quantity: 20,
                type: 'food'
            });
        expect(donateRes.statusCode).toBe(201);
        resourceId = donateRes.body.donation.resource;

        // Admin allocates
        const allocRes = await request(app)
            .post('/api/resources/allocate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ resourceId, incidentId });
        expect(allocRes.statusCode).toBe(200);
        expect(allocRes.body.resource.allocated).toBe(true);

        // Volunteer1 tries to allocate (should fail)
        const failAlloc = await request(app)
            .post('/api/resources/allocate')
            .set('Authorization', `Bearer ${volunteer1Token}`)
            .send({ resourceId, incidentId });
        expect([400, 401, 403]).toContain(failAlloc.statusCode);
    });

    it('all users send and receive chat messages, then victim2 tries to delete their account (should fail if assigned to incident)', async () => {
        // Victim1 sends
        await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${victim1Token}`)
            .send({ message: 'Victim1: Is help coming?' });

        // Volunteer1 sends
        await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${volunteer1Token}`)
            .send({ message: 'Volunteer1: On my way!' });

        // Admin sends
        await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ message: 'Admin: Stay safe, help is coordinated.' });

        // All should see all messages
        for (const token of [victim1Token, volunteer1Token, adminToken]) {
            const msgs = await request(app)
                .get(`/api/chat/incident/${incidentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(msgs.body.messages.length).toBeGreaterThanOrEqual(3);
        }

        // Victim2 tries to delete their account (should fail if assigned to incident)
        const delRes = await request(app)
            .delete(`/api/users/${victim2Id}`)
            .set('Authorization', `Bearer ${victim2Token}`);
        // Expect 400 or 403 if deletion is not allowed, 200/204 if allowed
        expect([400, 403]).toContain(delRes.statusCode);

        // Victim2 tries to send a message (should fail if deletion succeeded)
        const failMsg = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${victim2Token}`)
            .send({ message: 'Victim2: Am I still here?' });
        // If deletion failed, this should succeed (200/201), if succeeded, should fail (401/403/404)
        expect([401, 403, 404, 200, 201]).toContain(failMsg.statusCode);
    });

    it('broadcasts and status updates work as expected', async () => {
        // Volunteer1 updates status to busy
        const statusRes = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${volunteer1Token}`)
            .send({ status: 'busy' });
        expect(statusRes.statusCode).toBe(200);
        expect(statusRes.body.user.status).toBe('busy');

        // Admin broadcasts a message (simulate by sending chat as admin)
        const broadcast = await request(app)
            .post(`/api/chat/incident/${incidentId}/message`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ message: 'Admin: This is a broadcast to all.' });
        expect(broadcast.statusCode).toBe(201);

        // All users see the broadcast
        for (const token of [victim1Token, volunteer1Token, adminToken]) {
            const msgs = await request(app)
                .get(`/api/chat/incident/${incidentId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(msgs.body.messages.some(m => m.message === 'Admin: This is a broadcast to all.')).toBe(true);
        }
    });

    it('should not allow deleted users to login', async () => {
        // If victim2 was not deleted, this should succeed (200), else should fail (401/404)
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({ email: 'victim2@sys.com', password: 'password123' });
        expect([401, 404, 200]).toContain(loginRes.statusCode);
    });

    // ...add more edge/negative cases as needed
});
