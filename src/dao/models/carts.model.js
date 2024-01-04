import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    userEmail: {type: String},
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products', 
        },
        quantity: {
            type: Number,
        }
    }],
    totalPrice: { type: Number, default: 0}
}, {
    timestamps: true
});

cartsSchema.pre('findOne', function() {
    this.populate('products.productId');
});

export default mongoose.model('Carts', cartsSchema);
