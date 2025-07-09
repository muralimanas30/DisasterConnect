const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

describe('Volunteer API', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should get all volunteers', async () => {
        const token = '...'; // Replace with actual token logic
        const res = await request(app)
            .get('/api/volunteers')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('volunteers');
    });

    // ...add more tests for assignment, location update, etc.
});
