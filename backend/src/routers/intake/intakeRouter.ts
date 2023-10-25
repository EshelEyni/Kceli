import express from "express";
import {
  getUserFavoriteIntakes,
  createFavoriteIntake,
  updateFavoriteIntake,
  removeFavoriteIntake,
} from "../../controllers/intake/intakeController";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/favorite", getUserFavoriteIntakes);
router.post("/favorite", createFavoriteIntake);
router.patch("/favorite/:id", updateFavoriteIntake);
router.delete("/favorite/:id", removeFavoriteIntake);

export default router;
