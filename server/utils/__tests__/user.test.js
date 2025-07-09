const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const User = require('../../models/User');
const { MONGO_URI } = require('../../config');

describe('User API', () => {
    beforeAll(async () => {
        // Ensure DB is connected before tests
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Clean up users collection before tests
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Clean up users collection after tests and disconnect mongoose
        await User.deleteMany({});
        await mongoose.disconnect();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
    });

    it('should not register with missing fields', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ email: 'fail@example.com' });
        expect(res.statusCode).toBe(400);
    });

    it('should not register with duplicate email', async () => {
        // Register first user
        await request(app)
            .post('/api/users/register')
            .send({
                name: 'dupeuser',
                email: 'dupe@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        // Try to register again with same email
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'dupeuser2',
                email: 'dupe@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        expect(res.statusCode).toBe(400);
    });

    it('should login with correct credentials', async () => {
        // Register user
        await request(app)
            .post('/api/users/register')
            .send({
                name: 'loginuser',
                email: 'loginuser@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        // Login
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'loginuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('loginuser@example.com');
        expect(res.body.user.role).toBe('victim');
        expect(res.body.user).toHaveProperty('_id');
        expect(res.body.user).not.toHaveProperty('password'); // password should not be returned
    });

    it('should not login with wrong password', async () => {
        // Register user
        await request(app)
            .post('/api/users/register')
            .send({
                name: 'wrongpassuser',
                email: 'wrongpass@example.com',
                password: 'password123',
                role: 'victim',
                currentLocation: { type: 'Point', coordinates: [77, 12] }
            });
        // Attempt login with wrong password
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'wrongpass@example.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toBe(401);
    });

    it('should not login with non-existent email', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'notfound@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(401);
    });

    // ...add more tests for get profile, update, delete, etc.
});
