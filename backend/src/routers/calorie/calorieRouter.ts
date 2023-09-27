import express from "express";
import { getCaloriesForItem } from "../../controllers/calorie/calorieController";
import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";

const router = express.Router();

router.use(checkUserAuthentication);
router.post("/item", getCaloriesForItem);

export default router;
