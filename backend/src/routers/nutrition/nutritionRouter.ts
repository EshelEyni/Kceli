import express from "express";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";
import { queryChatGPT } from "../../controllers/nutrition/nutritionController";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/chatGPT", queryChatGPT);

export default router;
