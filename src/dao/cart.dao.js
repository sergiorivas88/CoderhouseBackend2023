import cartsModel from "./models/carts.model.js";
export default class {
    static async create(userEmail) {
        return await cartsModel.create({ userEmail: userEmail, products: [] })
    }
    static async findById(cid) {
        return await cartsModel.findById(cid)
    }
    static async findOneAndUpdate(criteria) {
        return await cartsModel.findOneAndUpdate(criteria, update, { new: true })
    }
    static async find() {
        return await cartsModel.find()
    }
}