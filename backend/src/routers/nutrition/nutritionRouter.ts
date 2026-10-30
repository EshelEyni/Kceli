import express from "express";
import rateLimit from "express-rate-limit";
import { scanFood } from "../../controllers/nutrition/foodScanController";
import { AppError } from "../../services/error/errorService";

import { checkUserAuthentication } from "../../middlewares/authGuards/authGuardsMiddleware";
import { queryChatGPT } from "../../controllers/nutrition/nutritionController";

const router = express.Router();

router.use(checkUserAuthentication);
router.get("/chatGPT", queryChatGPT);
router.post("/scan-food", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
}, rateLimit({ windowMs: 15 * 60 * 1000, max: 20,
  message: { message: "Too many food scans. Please try again later." } }),
(req, res, next) => express.json({ limit: "3mb" })(req, res, error => {
  // Body-parser errors can contain the original photo payload.
  next(error ? new AppError("Please send a valid photo request smaller than 3 MB.", error.status === 413 ? 413 : 400) : undefined);
}), scanFood);

export default router;
