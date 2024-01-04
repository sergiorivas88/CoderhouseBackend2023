import productsModel from './models/products.model.js'
import { Exception } from '../utils.js';

export default class {
    static async addProduct(data){
        const isAdded = await productsModel.findOne({code: data.code});
        if(isAdded){
            throw new Exception("There is a product already added with the same code", 404);
        }
        await productsModel.create(data);
        return true;
    }
    static async getProducts( query = {} ){
        const criteria = {};
        if (query.category) {
            criteria.category = query.category;
        }
        return productsModel.find(criteria);

    }
    static async getProductById(pid){
        const product = await productsModel.findById(pid);
        if(!product){
            throw new Exception("There is no product by that id", 404);
        }
        return product;
    }
    static async updateProduct(pid, data) {
        const product = await productsModel.findById(pid);
        if(!product){
            throw new Exception("There is no product by that id", 404);
        }
        const criteria = { _id: pid };
        const operation = { $set: data };
        await productsModel.updateOne(criteria, operation);
        return true;
    }
    static async deletePoduct(pid){
        const product = await productsModel.findById(pid);
        if(!product){
            throw new Exception("There is no product by that id", 404);
        }
        await productsModel.deleteOne(product);
        return true;
    }
}