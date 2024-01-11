import { ticketRepository } from "../repositories/index.js"
export default class {
    static async createTicket(req, uniqueCode, date, amount, userEmail, purchasedProductsData){
        return await ticketRepository.create(req, uniqueCode, date, amount, userEmail, purchasedProductsData)
    }
}