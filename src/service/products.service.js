import { productsRepository } from "../repositories/index.js"

export default class {
    static async findOne(data) {
        return await productsRepository.findOne(data)
    }
    static async create(data) {
        return await productsRepository.create(data)
    }
    static async find(criteria) {
        return await productsRepository.find(criteria)
    }
    static async findById(pid) {
        return await productsRepository.findById(pid)
    }
    static async updateOne(criteria, operation) {
        return await productsRepository.updateOne(criteria, operation)
    }
    static async deleteOne(product) {
        return await productsRepository.deleteOne(product)
    }
}
