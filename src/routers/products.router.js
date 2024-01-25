import { Router } from 'express';
import productsController from '../controller/products.controller.js'
import productsModel from '../dao/models/products.model.js';
import { authenticateLevel } from '../utils/utils.js';


const router = Router();

router.get("/products", async (req, res) => {
    const { limit, page, sort, status, category, title } = req.query;

    try {
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
        };

        const filter = {};

        if (category) {
            filter.category = category;
        }
        if (status) {
            filter.status = status;
        }
        if (title) {
            filter.title = title;
        }
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const result = await productsModel.paginate(filter, options);

        const currentUser = req.user;
        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${options.limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${options.limit}` : null,
            user: currentUser
        });
    } catch (error) {
        req.logger.error("Error fetching products:", error)
        res.status(500).send("Error fetching products.");
    }
});

router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const currentUser = req.user;

    try {
        const product = await productsModel.findById(id);

        if (req.accepts('html')) {
            if (product) {
                return res.render('product-detail', { product, user: currentUser });
            }
        }

        const productControllerResult = await productsController.getProductById(id);

        if (productControllerResult) {
            res.json({ product: productControllerResult });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        req.logger.error("Error fetching products:", error)
        res.status(500).json({ message: "Error fetching product" });
    }
});
router.post("/products", authenticateLevel(4), async (req, res) => {
    try{
        let owner = req.user.email
        let { body : data } = req;
        if(owner === "adminCoder@coder.com") {
            data = {
                ...data,
            };
        } else {
            data = {
                ...data,
                owner: owner
            };
        }
        let added = await productsController.addProduct(data);
        if(added){
            res.status(200).send(added)
        } else {
            res.status(400).send(data)
        }
    } 
    catch (error) {
        req.logger.error("Error adding products:", error)
        res.status(500).send("Error adding product.");
    }
})

router.put("/products/:pid", authenticateLevel(4), async (req, res) => {
    const id = req.params.pid;
    let owner = req.user.email
    if(owner === "adminCoder@coder.com"){
        owner = "admin"
    }
    try {
        const products = await productsController.getProductById(id)
        if(!products){
            const productsObj = {
                product: "There is no product by that id"
            }
            res.status(404).send(productsObj);
        } else {
            if(products.owner === owner){
                let { body : data } = req;
                data = {
                    ...data,
                };
                await productsController.updateProduct(id, data);
            } else {
                res.status(405).send("You may not be the owner to change it data or you may not have the permission to do so")
                return
            }
            const newProduct = await productsController.getProductById(id)
            res.status(200).send(newProduct);
        }
    } catch (error) {
        req.logger.error("Error fetching products:", error)
        res.status(500).send("Error fetching products.");
    }
})

router.delete("/products/:pid", authenticateLevel(4), async (req, res) => {
    const id = req.params.pid;
    let owner = req.user.email
    if(owner === "adminCoder@coder.com"){
        owner = "admin"
    }
    try {
        let deleted = await productsController.deletePoduct(id, owner)
        if(deleted){
            deleted = true
        } else {
            deleted = false
        }
        res.status(200).send(`The product is deleted? : ${deleted} - You may not be the owner of this product or you may not have the permission to do so`);
    }
    catch (error){
        req.logger.error("Error deleting products:", error)
        res.status(500).send("Error deleting product");
    }
})


export default router;
