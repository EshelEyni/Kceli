"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dayController_1 = require("../../controllers/day/dayController");
const authGuardsMiddleware_1 = require("../../middlewares/authGuards/authGuardsMiddleware");
const router = express_1.default.Router();
router.use(authGuardsMiddleware_1.checkUserAuthentication);
router.get("/", dayController_1.getAllDays);
router.get("/:id([a-fA-F0-9]{24})", dayController_1.getDay);
router.get("/today", dayController_1.getToday);
router.get("/calenderData", dayController_1.getCalenderData);
router.post("/", dayController_1.createDay);
router.patch("/:id", dayController_1.updateDay);
exports.default = router;
//# sourceMappingURL=dayRouter.js.map