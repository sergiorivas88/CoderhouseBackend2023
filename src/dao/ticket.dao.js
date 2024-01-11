import ticketModel from "./models/ticket.model.js";

export default class TicketService {
    static async create(req, code, purchase_datetime, amount, purchaser, products){
        try {
            const ticket = await ticketModel.create({
                code,
                purchase_datetime,
                amount,
                purchaser,
                products,
            });
            return ticket;
        } catch (error) {
            req.logger.error("Error creating ticket:", error);
            throw new Error("Error creating ticket");
        }
    }
}
