import express from "express";

import {
  getGoals,
  getGoalById,
  getUserGoal,
  createGoal,
  deleteGoal,
  updateGoal,
} from "../../controllers/goal/goalController";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/", getGoals);
router.get("/:id([a-fA-F0-9]{24})", getGoalById);
router.get("/user", getUserGoal);
router.post("/", createGoal);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
