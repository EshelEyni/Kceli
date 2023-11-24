"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const goalController_1 = require("../../controllers/goal/goalController");
const authGuardsMiddleware_1 = require("../../middlewares/authGuards/authGuardsMiddleware");
const router = express_1.default.Router();
router.use(authGuardsMiddleware_1.checkUserAuthentication);
router.get("/", goalController_1.getGoals);
router.get("/:id", goalController_1.getGoalById);
router.post("/", goalController_1.createGoal);
router.patch("/:id", goalController_1.updateGoal);
router.delete("/:id", goalController_1.deleteGoal);
exports.default = router;
//# sourceMappingURL=goalRouter.js.map