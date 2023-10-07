"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authGuardsMiddleware_1 = require("../../middlewares/authGuards/authGuardsMiddleware");
const nutritionController_1 = require("../../controllers/nutrition/nutritionController");
const router = express_1.default.Router();
router.use(authGuardsMiddleware_1.checkUserAuthentication);
router.get("/chatGPT", nutritionController_1.queryChatGPT);
router.get("/ninja", nutritionController_1.queryNinjaAPI);
router.get("/usda", nutritionController_1.queryUSDA);
exports.default = router;
//# sourceMappingURL=nutritionRouter.js.map