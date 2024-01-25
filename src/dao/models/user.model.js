import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}, 
    email: {
        type: String,
        unique: true,  
        sparse: true,
        required: true,  
    },
    age: {type: Number, required: true},
    password: {type: String, required: true}, 
    role: {type: String, default: "user"},
    cart: { type: mongoose.Schema.Types.ObjectId,
            ref: 'Carts', 
        },
    provider: { type: String, default: "app" },
    githubId: { type: String, unique: true, sparse: true, default: undefined },
    resetLink: {
        token: { type: String, default: null },
        date: { type: Date, default: null },
    }
}, { timestamps: true });

userSchema.pre('findOne', function() {
    this.populate('cart.cartId');
});


export default mongoose.model('User', userSchema);