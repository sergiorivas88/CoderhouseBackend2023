import supertest from 'supertest';
import * as chai from 'chai';
import app from '../src/app.js'; 
import mongoose from 'mongoose';
import config from '../src/config/envConfig.js';

const expect = chai.expect;
describe('Cart Router', function() {
    this.beforeAll(async () => {
        app.listen(8080)
        await mongoose.connect(config.db.URI_DEV)
    });

    this.afterAll(async () => {
        await mongoose.disconnect()
    });

    describe('POST /carts/:cid/product/:pid', () => {
        it('should add a product to the cart', async () => {
            const cartId = 'someCartId';
            const productId = 'someProductId';
            const response = await supertest(app)
                .post(`/api/carts/${cartId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ quantity: 1 })
                .expect(200);

            expect(response.body).to.have.property('message', 'Product added to the cart');
            expect(response.body.cart).to.include.deep.members([{ productId, quantity: 1 }]);
        });
    });

    describe('PUT /carts/:cid/product/:pid', () => {
        it('should update the quantity of a product in the cart', async () => {
            const cartId = 'someCartId';
            const productId = 'someProductId';
            const response = await supertest(app)
                .put(`/api/carts/${cartId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ quantity: 2 })
                .expect(200);

            expect(response.body).to.have.property('message', 'Product quantity updated');
            expect(response.body.cart).to.include.deep.members([{ productId, quantity: 2 }]);
        });
    });

    describe('DELETE /carts/:cid/product/:pid', () => {
        it('should delete a product from the cart', async () => {
            const cartId = 'someCartId';
            const productId = 'someProductId';
            const response = await supertest(app)
                .delete(`/api/carts/${cartId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).to.have.property('message', 'Product deleted from the cart');
            
        });
    });

    describe('POST /carts', () => {
        it('should create a new cart', async () => {
            const cartData = { userId: 'someUserId' }; 
            const response = await supertest(app)
                .post('/api/carts')
                .set('Authorization', `Bearer ${authToken}`)
                .send(cartData)
                .expect(201);

            expect(response.body).to.have.property('message', 'Cart created successfully');
            expect(response.body.cart).to.include(cartData);
        });
    });

    describe('GET /carts/:cid', () => {
        it('should fetch the contents of a cart', async () => {
            const cartId = 'someCartId';
            const response = await supertest(app)
                .get(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).to.have.property('cart');
            expect(response.body.cart).to.be.an('object');
        });
    });

    describe('PUT /carts/:cid', () => {
        it('should update the products array of a cart', async () => {
            const cartId = 'someCartId';
            const products = [{ productId: 'someProductId', quantity: 3 }]; 
            const response = await supertest(app)
                .put(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(products)
                .expect(200);

            expect(response.body).to.have.property('message', 'Products in the cart updated');
            expect(response.body.cart.products).to.deep.equal(products);
        });
    });

    describe('DELETE /carts/:cid', () => {
        it('should delete a cart', async () => {
            const cartId = 'someCartId';
            const response = await supertest(app)
                .delete(`/api/carts/${cartId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).to.have.property('message', 'Cart deleted successfully');
        });
    });

    describe('POST /carts/:cid/purchase', () => {
        it('should complete the purchase process for a cart', async () => {
            const cartId = 'someCartId';
            const response = await supertest(app)
                .post(`/api/carts/${cartId}/purchase`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).to.have.property('ticket');
            expect(response.body.ticket).to.be.an('object');
        });
    });


});