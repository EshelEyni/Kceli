"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const intakeController_1 = require("../../controllers/intake/intakeController");
const authGuardsMiddleware_1 = require("../../middlewares/authGuards/authGuardsMiddleware");
const router = express_1.default.Router();
router.use(authGuardsMiddleware_1.checkUserAuthentication);
router.get("/favorite", intakeController_1.getUserFavoriteIntakes);
router.post("/favorite", intakeController_1.createFavoriteIntake);
router.patch("/favorite/:id", intakeController_1.updateFavoriteIntake);
router.delete("/favorite/:id", intakeController_1.removeFavoriteIntake);
exports.default = router;
//# sourceMappingURL=intakeRouter.js.map