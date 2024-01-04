import productsModel from "./models/products.model.js";

export default class {
    static async findOne(data) {
        return await productsModel.findOne({code: data.code})
    }
    static async create(data) {
        return await productsModel.create(data)
    }
    static async find(criteria) {
        return await productsModel.find(criteria)
    }
    static async findById(pid) {
        return await productsModel.findById(pid)
    }
    static async updateOne(criteria, operation) {
        return await productsModel.updateOne(criteria, operation)
    }
    static async deleteOne(product) {
        return await productsModel.deleteOne(product)
    }
}