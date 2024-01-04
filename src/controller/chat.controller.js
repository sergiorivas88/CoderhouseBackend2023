import chatService from "../service/chat.service.js"
export default class {
    static async create(userEmail, message){
        return await chatService.create(userEmail, message)
    }
    static async find() {
        return await chatService.find()
    }
}