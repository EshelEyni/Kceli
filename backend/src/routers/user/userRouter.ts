import express from "express";
import {
  getUserById,
  getUserByUsername,
  getUsers,
  removeUser,
  updateUser,
  addUser,
  updateLoggedInUser,
  removeLoggedInUser,
  getUserDailyStats,
} from "../../controllers/user/userController";
import {
  checkUserAuthentication,
  checkAdminAuthorization,
} from "../../middlewares/authGuards/authGuardsMiddleware";

import { dailyMotivation } from "../../controllers/user/dailyMotivationController";

const router = express.Router();

router.use(checkUserAuthentication);
router.post("/daily-motivation", dailyMotivation);
router.get("/", getUsers);
router.get("/:id([a-fA-F0-9]{24})", getUserById);
router.get("/username/:username", getUserByUsername);
router.get("/dailyStats", getUserDailyStats);

router.patch("/loggedInUser", updateLoggedInUser);
router.delete("/loggedInUser", removeLoggedInUser);

router.use(checkAdminAuthorization);
router.post("/", addUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);

export default router;
