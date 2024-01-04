import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {type: String, unique: true, required: true},
    purchase_datetime: { type: Date, required: true},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true},
    products: [{
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }],

}, {    timestamps: true })

export default mongoose.model('Ticket', ticketSchema);