/*
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Resource = require('../../models/Resource');
const { MONGO_URI } = require('../../config');

let token;
let userId;
let resourceId;

describe('Resource API', () => {
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await User.deleteMany({});
        await Resource.deleteMany({});

        // Register and login a user to get a token
        const registerRes = await request(app)
            .post('/api/users/register')
            .send({
                name: 'resourceuser',
                email: 'resourceuser@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });

        if (registerRes.body && registerRes.body.token) {
            token = registerRes.body.token;
            userId = registerRes.body.user._id;
        } else {
            const loginRes = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'resourceuser@example.com',
                    password: 'password123'
                });
            token = loginRes.body.token;
            userId = loginRes.body.user._id;
        }
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Resource.deleteMany({});
        await mongoose.disconnect();
    });

    it('should donate a resource', async () => {
        const res = await request(app)
            .post('/api/resources/donate')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Water Bottles',
                quantity: 100,
                type: 'water'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('donation');
        resourceId = res.body.donation._id;
    });

    it('should not donate with missing fields', async () => {
        const res = await request(app)
            .post('/api/resources/donate')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Blankets'
                // missing quantity, type
            });
        expect(res.statusCode).toBe(400);
    });

    it('should get all resources', async () => {
        const res = await request(app)
            .get('/api/resources')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('resources');
        expect(Array.isArray(res.body.resources)).toBe(true);
    });

    it('should get resource by id', async () => {
        const res = await request(app)
            .get(`/api/resources/${resourceId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('resource');
        expect(res.body.resource._id).toBe(resourceId);
    });

    it('should get donation history', async () => {
        const res = await request(app)
            .get('/api/resources/history')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('history');
        expect(Array.isArray(res.body.history)).toBe(true);
    });

    it('should create a Razorpay order for monetary donation', async () => {
        const res = await request(app)
            .post('/api/resources/donate-money')
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 10,
                currency: 'INR',
                resourceType: 'food'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('order');
        expect(res.body.order).toHaveProperty('id');
        expect(res.body.donation).toBeDefined();
        expect(res.body.resource).toBeDefined();
    });

    // Edge case: Unauthorized access
    it('should fail without token', async () => {
        const res = await request(app)
            .get('/api/resources');
        expect(res.statusCode).toBe(401);
    });

    // Edge case: Invalid token
    it('should fail with invalid token', async () => {
        const res = await request(app)
            .get('/api/resources')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toBe(401);
    });

    // ...add more tests for allocation, bulk allocation, etc. as you implement them
});
*/