import { Router } from 'express';
import cartsController from '../controller/carts.controller.js';
import productsController from '../controller/products.controller.js'
import { authenticateLevel } from '../utils/utils.js';
import ticketController from '../controller/ticket.controller.js';

const router = Router();

router.post("/carts", async (req, res) => {
    try {
        let { body: data } = req;
        const cart = await cartsController.addCart(data);

        if (cart) {
            res.status(201).send({
                message: "Cart created successfully",
                cart: cart
            });
        } else {
            res.status(404).send("Cart not created.");
        }
    } catch (error) {
        req.logger.error("Error adding cart:", error)
        res.status(500).send("Error adding cart.");
    }
});

router.get("/carts/:cid", authenticateLevel(3), async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await cartsController.getCartContentById(id);
        if (cart) {
            res.render('cart', { cart: cart, user: req.user });
        } else {
            res.status(404).send({ message: "There is no cart by that id" });
        }
    } catch (error) {
        req.logger.error("Error finding cart:", error)
        res.status(500).send("Error finding cart.");
    }
})


router.post("/carts/:cid/product/:pid", authenticateLevel(3), async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const owner = req.user.email
    try {
        const product = await productsController.getProductById(idProduct);
        if(product.owner === owner){
            return res.status(403).send('You can\'t add your own product to the shopping cart')
        }
        if (product) {
            const productsObj = {
                productId: idProduct,
                quantity: 1
            };

            const updatedCart = await cartsController.addProductToCart(idCart, productsObj);

            if (updatedCart) {
                res.redirect(`/api/carts/${idCart}`);
                updatedCart.totalPrice += product.price;
                updatedCart.save()
            } else {
                res.status(400).send({ message: "Error adding the product to the cart" });
            }
        } else {
            req.logger.error("Product not found")
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        req.logger.error("Error updating the cart or adding the product:", error);
        res.status(500).send("Error updating the cart or adding the product");
    }
});

router.delete("/carts/:cid/product/:pid", authenticateLevel(3), async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    try {
        await cartsController.deleteProductOfCart(req, idCart, idProduct)
        return res.status(200).send({ message: "Products deleted" });
    } catch (error) {
        req.logger.error("Error updating the cart or deleting the products:", error);
        res.status(500).send("Error updating the cart or deleting the products");
    }
});

router.put("/carts/:cid", authenticateLevel(3), async (req, res) => {
    const idCart = req.params.cid;
    const products = req.body;

    try {
        const updatedCart = await cartsController.updateProductsArrayOfCart(req, idCart, products);

        if (updatedCart) {
            res.status(200).send({ message: "Products in the cart updated", cart: updatedCart });
        } else {
            res.status(400).send({ message: "Error updating the products in the cart" });
        }
    } catch (error) {
        req.logger.error("Error updating the cart or the products:", error);
        res.status(500).send("Error updating the cart or the products");
    }
})

router.put("/carts/:cid/product/:pid", authenticateLevel(3), async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const { quantity } = req.body; 

    try {
        const updatedCart = await cartsController.updateProductQuantityToCart(idCart, idProduct, quantity);

        if (updatedCart) {
            res.status(200).send({ message: "Product quantity in the cart updated", cart: updatedCart });
        } else {
            res.status(400).send({ message: "Error updating the product quantity in the cart" });
        }
    } catch (error) {
        req.logger.error("Error updating the cart or the product quantity:", error);
        res.status(500).send("Error updating the cart or the product quantity");
    }
})

router.delete("/carts/:cid", authenticateLevel(3), async (req, res) => {
    const idCart = req.params.cid;
    try {
        const updatedCart = await cartsController.deleteProductsOfCart(req, idCart);

        if (updatedCart) {
            res.status(200).send({ message: "All products deleted from the cart", cart: updatedCart });
        } else {
            res.status(400).send({ message: "Error deleting the products from the cart" });
        }
    } catch (error) {
        req.logger.error("Error updating the cart or deleting the products:", error);
        res.status(500).send("Error updating the cart or deleting the products");
    }
})
router.get("/carts", authenticateLevel(2), async (req, res) => {
    try {
        const carts = await cartsController.getCarts(req);
        for (let i = 0; i < carts.length; i++) {
            const element = carts[i];
            element.title = i;
        }
        if (carts) {
            res.render('cartsList', { carts });
        } else {
            res.status(400).send({ message: "No carts found" })
        }
    }
    catch (error) {
        req.logger.error("Error getting carts:", error);
        res.status(500).send("Error getting carts");
    }
})

router.post("/carts/:cid/purchase", async (req, res) => {
    const idCart = req.params.cid;
    try {
        const ticket = await ticketController.createTicket(req, idCart, req.user.email)
        if (ticket) {
            res.render('ticket', {ticket})
        } else {
            res.status(400).send({ message: "Error creating the ticket" });
        }
    }
    catch (error) {
        req.logger.error("Error purchasing:", error);
        res.status(500).send("Error completing the purchase");
    }
})
export default router;
