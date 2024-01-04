import messagesModel from "../dao/models/messages.model.js";
export default class {
    static async create(userEmail, message) {
        return await messagesModel.create({ userEmail, message })
    }
    static async find() {
        return await messagesModel.find()
    }
}