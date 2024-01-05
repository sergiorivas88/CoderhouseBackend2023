import { Router } from "express";
import { authenticateLevel } from "../utils/utils.js";
const router = Router();
import { generateProduct } from "../utils/utils.js";

router.get("/mockingproducts", authenticateLevel(2), (req, res) => {
  try {
    const numberOfProducts = 100;
    const simulatedProducts = Array.from(
      { length: numberOfProducts },
      generateProduct
    );
    res.json(simulatedProducts);
  } catch (Error) {
    console.log(Error);
  }
});

export default router;
