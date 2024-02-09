import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js'; // Adjust the path according to your project structure

describe('Sessions Router', () => {
    describe('POST /sessions/register', () => {
        it('should register a new user and redirect to login', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                age: "1"

            };
            const response = await supertest(app)
                .post('/auth/sessions/register')
                .send(userData)
                .expect(302); 

            expect(response.headers.location).to.equal('/login');

        });
    });

    describe('POST /sessions/login', () => {
        it('should login the user and redirect to /api/products', async () => {
            const credentials = {
                email: 'test@example.com',
                password: 'password123',
            };
            const response = await supertest(app)
                .post('/auth/sessions/login')
                .send(credentials)
                .expect(302); 

            expect(response.headers.location).to.equal('/api/products');
            expect(response.headers['set-cookie']).to.be.an('array').that.is.not.empty;
        });
    });

    describe('GET /sessions/logout', () => {
        it('should logout the user and redirect to /login', async () => {
            const response = await supertest(app)
                .get('/auth/sessions/logout')
                .expect(302); 

            expect(response.headers.location).to.equal('/login');
        });
    });

    describe('POST /sessions/changePassword', () => {
        it('should initiate the password change process', async () => {
            const requestData = {
                email: 'test@example.com',
            };
            const response = await supertest(app)
                .post('/auth/sessions/changePassword')
                .send(requestData)
                .expect(200); 

        });
    });

    describe('POST /sessions/trueChangePassword', () => {
        it('should successfully change the password and redirect to login', async () => {
            const requestData = {
                uid: 'validUserId', 
                password: 'newUniquePassword123'
            };
            const response = await supertest(app)
                .post('/auth/sessions/trueChangePassword')
                .send(requestData)
                .expect(302); 
            expect(response.headers.location).to.equal('/login');
        });
    });
});