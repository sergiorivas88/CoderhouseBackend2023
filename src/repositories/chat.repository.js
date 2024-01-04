export default class Chat {
    constructor(dao) {
        this.dao = dao;
    }
    async create(userEmail, message) {
        return await this.dao.create(userEmail, message);
    }
    async find() {
        return await this.dao.find();
    }
}