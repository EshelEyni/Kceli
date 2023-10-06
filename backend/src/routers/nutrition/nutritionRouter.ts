import express from "express";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";
import {
  queryChatGPT,
  queryNinjaAPI,
  queryUSDA,
} from "../../controllers/nutrition/nutritionController";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/chatGPT", queryChatGPT);
router.get("/ninja", queryNinjaAPI);
router.get("/usda", queryUSDA);

export default router;
