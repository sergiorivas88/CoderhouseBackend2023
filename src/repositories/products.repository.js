export default class Products {
    constructor(dao) {
        this.dao = dao;
    }
    async findOne(data) {
        return await this.dao.findOne(data)
    }
    async create(data) {
        return await this.dao.create(data)
    }
    async find(criteria) {
        return await this.dao.find(criteria)
    }
    async findById(pid) {
        return await this.dao.findById(pid)
    }
    async updateOne(criteria, operation) {
        return await this.dao.updateOne(criteria, operation)
    }
    async deleteOne(product) {
        return await this.dao.deleteOne(product)
    }
}