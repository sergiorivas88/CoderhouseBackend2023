export default class Ticket {
    constructor(dao) {
        this.dao = dao;
    }
    async create(uniqueCode, date, amount, userEmail, purchasedProductsData){
        return await this.dao.create(uniqueCode, date, amount, userEmail, purchasedProductsData)
    }
}