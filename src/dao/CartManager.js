import cartsModel from './models/carts.model.js';
import { Exception } from '../utils.js';

export default class {
    static async addCart(userEmail){ 
        const newCart = await cartsModel.create({ userEmail: userEmail, products: [] });
        return newCart;
    }

    static async getCartContentById(cid) {
        const cart = await isCart(cid);
        return cart;
    }
    
    static async addProductToCart(cid, product) {
        const cart = await isCart(cid);
        if (cart) {
            const existingProductIndex = cart.products.findIndex(p => p.productId._id.toString() === product.productId.toString());

    
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++;
            } else {
                cart.products.push(product);
            }
    
            await cart.save();
            return true;
        }
    }
    
    static async deleteProductOfCart(cid, pid) {
        const cart = isCart(cid);
        if (cart) {
            const productIndex = cart.products.findIndex(product => product.productId._id.toString() === pid);
    
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                
                await cart.save();
                return true;
            } else {
                throw new Exception("There is no product by that id", 404);
            }
        }
    }
    
    static async updateProductsArrayOfCart(cid, products) {
        const cart = await isCart(cid);
    
        if (cart) {
            try {
                const criteria = { _id: cid };
                let update = { products: products };
    
                if (!Array.isArray(products)) {
                    update = { products: [products] };
                }
    
                const updatedCart = await cartsModel.findOneAndUpdate(criteria, update, { new: true });
    
                if (!updatedCart) {
                    throw new Exception("Failed to update cart", 500);
                }
    
                return updatedCart;
            } catch (error) {
                console.error("Error updating cart:", error);
                throw new Exception("Error updating cart", 500);
            }
        }
    }
    
    
    static async updateProductQuantityToCart(cid, pid, quantity) {
        const cart = await isCart(cid); 
    
        if (cart) {
            try {
                const existingProductIndex = cart.products.findIndex(product => product.productId._id.toString() === pid);
    
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity; 
                } else {
                    throw new Exception("There is no product by that id in the cart", 404);
                }
    
                await cart.save();
                return cart; 
            } catch (error) {
                throw new Exception("Error updating product quantity", 500);
            }
        }
    }
        
    static async deleteProductsOfCart(cid) {
        const cart = await isCart(cid); 
    
        if (cart) {
            try {
                cart.products = []; 
    
                await cart.save();
                return cart; 
            } catch (error) {
                console.error("Error deleting products from the cart:", error);
                throw new Exception("Error deleting products from the cart", 500);
            }
        }
    }
    static async getCarts() {
        try {
            const carts = await cartsModel.find();
            return carts;
        }
        catch (error) {
            console.error("Error getting carts:", error);
            throw new Exception("Error getting carts", 500);
        }

    }
}

async function isCart(cid) {
    const cart = await cartsModel.findById(cid);
        if(!cart){
            throw new Exception("There is no cart by that id", 404);
        }
    return cart
}
