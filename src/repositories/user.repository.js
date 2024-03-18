export default class User {
    constructor(dao) {
        this.dao = dao;
    }
    async create(data) {
        return await this.dao.create(data)
    }
    async findOneDataEmail(data) {
        return await this.dao.findOneDataEmail(data)
    }
    async findOneGithubId(data) {
        return await this.dao.findOneGithubId(data)
    }
    async findById(uid) {
        return await this.dao.findById(uid)
    }
    async findOneByEmail(email) {
        return await this.dao.findOneByEmail(email)
    }
    async findOneByGithubId(gitId) {
        return await this.dao.findOneByGithubId(gitId)
    }
    async getUsers(){
        return await this.dao.getUsers()
    }
    async deleteUser(uid){
        return await this.dao.deleteUser(uid)
    }
}