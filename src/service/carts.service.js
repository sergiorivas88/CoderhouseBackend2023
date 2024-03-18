import { cartRepository } from "../repositories/index.js"
export default class {
    static async create(userEmail) {
        return await cartRepository.create(userEmail)
    }
    static async findById(cid) {
        return await cartRepository.findById(cid)
    }
    static async findOneAndUpdate(criteria) {
        return await cartRepository.findOneAndUpdate(criteria)
    }
    static async find() {
        return await cartRepository.find()
    }
    static async remove(cid){
        return await cartRepository.remove(cid)
    }
}