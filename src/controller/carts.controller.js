import cartsService from "../service/carts.service.js";
import { Exception } from "../utils/utils.js";
import { createError } from '../utils/createError.js';
import errorList from '../utils/errorList.js';
import { generatorCartIdError } from "../utils/errorCause.js";
export default class {
    static async addCart(userEmail){ 
        return await cartsService.create(userEmail)
    }

    static async getCartContentById(cid) {
        return await isCart(cid);
    }
    
    static async addProductToCart(cid, product) {
        try {
            const cart = await isCart(cid);
            if (cart) {
                const existingProductIndex = cart.products.findIndex(p => p.productId._id.toString() === product.productId.toString());

        
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity++;
                } else {
                    cart.products.push(product);
                }
        
                await cart.save();
                return cart;
            }
        }
        catch (error) {
            createError.Error({
                name: 'AddingProductToCart error',
                cause: error,
                message: 'An error occured within the addProductToCart method',
                code: errorList.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async deleteProductOfCart(req, cid, pid) {
        try {
            const cart = await isCart(cid);
    
            if (cart && cart.products) {
                const productIndex = cart.products.findIndex(product => product.productId._id.toString() === pid.toString());
    
                if (productIndex !== -1) {
                    const productToRemove = cart.products[productIndex];
    
                    cart.totalPrice -= productToRemove.productId.price * productToRemove.quantity;
    
                    cart.products.splice(productIndex, 1);
    
                    await cart.save();
    
                    return cart;
                } else {
                    throw new Exception("There is no product by that id in the cart", 404);
                }
            } else {
                throw new Exception("Invalid cart or cart products", 500);
            }
        } catch (error) {
            req.logger.error("Error deleting product from cart:", error);
            throw new Exception("Error deleting product from cart", 500);
        }
    }
    
    
    
    
    
    static async updateProductsArrayOfCart(req, cid, products) {
        const cart = await isCart(cid);
    
        if (cart) {
            try {
                const criteria = { _id: cid };
                let update = { products: products };
    
                if (!Array.isArray(products)) {
                    update = { products: [products] };
                }
    
                const updatedCart = await cartsService.findOneAndUpdate(criteria)
    
                if (!updatedCart) {
                    throw new Exception("Failed to update cart", 500);
                }
    
                return updatedCart;
            } catch (error) {
                req.logger.error("Error updating cart:", error);
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
        
    static async deleteProductsOfCart(req, cid) {
        const cart = await isCart(cid); 
    
        if (cart) {
            try {
                cart.products = []; 
    
                await cart.save();
                return cart; 
            } catch (error) {
                req.logger.error("Error deleting products from the cart:", error);
                throw new Exception("Error deleting products from the cart", 500);
            }
        }
    }
    static async getCarts(req) {
        try {
            const carts = await cartsService.find();
            return carts;
        }
        catch (error) {
            req.logger.error("Error getting carts:", error);
            throw new Exception("Error getting carts", 500);
        }

    }
}


async function isCart(cid) {
    const cart = await cartsService.findById(cid);
        if(!cart){
            createError.Error({
                name: 'Invalid param error',
                cause: generatorCartIdError(cid),
                message: 'There is no cart by that id',
                code: errorList.INVALID_PARAMS_ERROR,
            });
        }
    return cart
}