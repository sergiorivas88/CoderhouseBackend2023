import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    thumbnail: { type: String},
    code: { type: String, required: true},
    stock: { type: Number, required: true},
    status: { type: Boolean, default:'active'},
    category: { type: String, required: true},
    owner: {type: String, default: "admin"}
}, {    timestamps: true })
productsSchema.plugin(mongoosePaginate);
export default mongoose.model('Products', productsSchema);