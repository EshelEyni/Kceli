"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workoutController_1 = require("../../controllers/workout/workoutController");
const authGuardsMiddleware_1 = require("../../middlewares/authGuards/authGuardsMiddleware");
const router = express_1.default.Router();
router.use(authGuardsMiddleware_1.checkUserAuthentication);
router.get("/", workoutController_1.getAllWorkouts);
router.get("/:id([a-fA-F0-9]{24})", workoutController_1.getWorkout);
router.post("/", workoutController_1.createWorkout);
router.patch("/:id", workoutController_1.updateWorkout);
router.delete("/:id", workoutController_1.deleteWorkout);
exports.default = router;
//# sourceMappingURL=workoutRouter.js.map