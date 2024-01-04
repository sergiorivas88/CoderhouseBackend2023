export default class Cart {
    constructor(dao) {
        this.dao = dao;
    }
    async create(userEmail) {
        return await this.dao.create(userEmail)
    }
    async findById(cid) {
        return await this.dao.findById(cid)
    }
    async findOneAndUpdate(criteria) {
        return await this.dao.findOneAndUpdate(criteria)
    }
    async find() {
        return await this.dao.find()
    }
}