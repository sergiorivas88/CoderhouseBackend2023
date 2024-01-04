import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    message: { type: String, required: true }
}, {    timestamps: true })

export default mongoose.model('Messages', messagesSchema );