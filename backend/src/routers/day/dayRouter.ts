import express from "express";
import {
  getAllDays,
  getDay,
  getToday,
  createDay,
  updateDay,
} from "../../controllers/day/dayController";
import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/", getAllDays);
router.get("/:id([a-fA-F0-9]{24})", getDay);
router.get("/today", getToday);
router.post("/", createDay);
router.patch("/:id", updateDay);

export default router;
