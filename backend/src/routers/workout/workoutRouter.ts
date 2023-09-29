import express from "express";
import {
  getAllWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../../controllers/workout/workoutController";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/", getAllWorkouts);
router.get("/:id([a-fA-F0-9]{24})", getWorkout);
router.post("/", createWorkout);
router.patch("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
