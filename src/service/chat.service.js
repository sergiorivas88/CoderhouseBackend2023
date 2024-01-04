import { chatRepository } from "../repositories/index.js";
export default class{
    static async create(userEmail, message) {
        return await chatRepository.create(userEmail, message);
    }
    static async find() {
        return await chatRepository.find();
    }
}