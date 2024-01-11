
import { Router } from 'express';
import { authenticateLevel } from '../utils/utils.js';
const router = Router();
import { generateProduct } from '../utils/utils.js';

router.get("/mockingproducts", authenticateLevel(2), (req, res) => {
    try{
        const numberOfProducts = 100;
        const simulatedProducts = Array.from({ length: numberOfProducts }, generateProduct);
        res.json(simulatedProducts);
    }
    catch (Error) {
        req.logger.error(Error)
    }
})

router.get("/loggerTest", authenticateLevel(2), (req, res) => {
    try {
        req.logger.debug("Debug Test")
        req.logger.http("Http Test")
        req.logger.info("Info Test")
        req.logger.warning("Warning Test")
        req.logger.error("Error Test")
        req.logger.fatal("Fatal Test")
        res.send("End of tests")
    }
    catch (Error) {
        req.logger.error(Error)
    }
})

export default router;
