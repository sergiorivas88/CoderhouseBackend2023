import { ticketRepository } from "../repositories/index.js";
export default class {
  static async createTicket(
    uniqueCode,
    date,
    amount,
    userEmail,
    purchasedProductsData
  ) {
    return await ticketRepository.create(
      uniqueCode,
      date,
      amount,
      userEmail,
      purchasedProductsData
    );
  }
}
