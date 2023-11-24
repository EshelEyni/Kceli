import express from "express";

import {
  getGoals,
  getGoalById,
  createGoal,
  deleteGoal,
  updateGoal,
} from "../../controllers/goal/goalController";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/", getGoals);
router.get("/:id", getGoalById);
router.post("/", createGoal);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
