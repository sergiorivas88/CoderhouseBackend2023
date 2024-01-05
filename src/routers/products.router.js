import { Router } from "express";
import productsController from "../controller/products.controller.js";
import productsModel from "../dao/models/products.model.js";
import { authenticateLevel } from "../utils/utils.js";

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
    if (sort === "asc" || sort === "desc") {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await productsModel.paginate(filter, options);

    const currentUser = req.user;
    res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.page - 1}&limit=${options.limit}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.page + 1}&limit=${options.limit}`
        : null,
      user: currentUser,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products.");
  }
});

router.get("/products/:pid", async (req, res) => {
  const id = req.params.pid;
  const currentUser = req.user;

  try {
    const product = await productsModel.findById(id);

    if (req.accepts("html")) {
      if (product) {
        return res.render("product-detail", { product, user: currentUser });
      }
    }

    const productControllerResult = await productsController.getProductById(id);

    if (productControllerResult) {
      res.json({ product: productControllerResult });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});
router.post("/products", authenticateLevel(2), async (req, res) => {
  try {
    let { body: data } = req;
    data = {
      ...data,
    };
    let added = await productsController.addProduct(data);
    if (added) {
      res.status(200).send(data);
    } else {
      res.status(400).send(data);
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Error adding product.");
  }
});

router.put("/products/:pid", authenticateLevel(2), async (req, res) => {
  const id = req.params.pid;
  try {
    const products = await productsController.getProductById(id);
    if (!products) {
      const productsObj = {
        product: "There is no product by that id",
      };
      res.status(404).send(productsObj);
    } else {
      let { body: data } = req;
      data = {
        ...data,
      };
      await productsController.updateProduct(id, data);
      const newProduct = await productsController.getProductById(id);
      res.status(200).send(newProduct);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products.");
  }
});

router.delete("/products/:pid", authenticateLevel(2), async (req, res) => {
  const id = req.params.pid;
  try {
    let deleted = await productsController.deletePoduct(id);
    if (deleted) {
      deleted = true;
    } else {
      deleted = false;
    }
    res.status(200).send(`The product is deleted? : ${deleted}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product");
  }
});

export default router;
