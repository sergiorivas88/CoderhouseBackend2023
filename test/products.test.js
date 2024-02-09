import supertest from 'supertest';
import * as chai from 'chai';
import app from '../src/app.js';
import mongoose from 'mongoose';
import config from '../src/config/envConfig.js';


const expect = chai.expect;

describe('Products Router', () => {
    this.beforeAll(async () => {
        app.listen(8080)
        await mongoose.connect(config.db.URI_DEV)
    });

    this.afterAll(async () => {
        await mongoose.disconnect()
    });
    describe('GET /products', () => {
        it('should fetch products with default pagination', async () => {
            const response = await supertest(app)
                .get('/api/products')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).to.be.an('object');
            expect(response.body.products).to.be.an('array');
            expect(response.body.totalPages).to.be.a('number');
            expect(response.body.prevLink).to.satisfy((link) => link === null || typeof link === 'string');
            expect(response.body.nextLink).to.satisfy((link) => link === null || typeof link === 'string');
        });
    });

    describe('GET /products/:pid', () => {
        it('should fetch a single product by id', async () => {
            const productId = 'someProductId'; 
            const response = await supertest(app)
                .get(`/api/products/${productId}`)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).to.be.an('object');
            expect(response.body.product).to.be.an('object');
            expect(response.body.product.id).to.equal(productId);
        });
    });

    describe('POST /products', () => {
        it('should create a new product', async () => {
            const productData = {
                title: 'Test Product',
                price: 100,
                category: 'Test Category',
                status: 'available'
            };

            const response = await supertest(app)
                .post('/api/products')
                .send(productData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).to.include.keys('id', 'title', 'price', 'category', 'status');
            expect(response.body.title).to.equal(productData.title);
        });
    });

    describe('PUT /products/:pid', () => {
        it('should update a product', async () => {
            const productId = 'someProductId'; 
            const updateData = {
                price: 150
            };

            const response = await supertest(app)
                .put(`/api/products/${productId}`)
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).to.be.an('object');
            expect(response.body.price).to.equal(updateData.price);
        });
    });

    describe('DELETE /products/:pid', () => {
        it('should delete a product', async () => {
            const productId = 'someProductId'; 

            const response = await supertest(app)
                .delete(`/api/products/${productId}`)
                .expect(200);

            expect(response.text).to.include('The product is deleted? : true');
        });
    });
});