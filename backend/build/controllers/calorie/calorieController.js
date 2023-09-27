"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaloriesForItem = void 0;
const openAIService_1 = __importDefault(require("../../services/openAI/openAIService"));
const errorService_1 = require("../../services/error/errorService");
const getCaloriesForItem = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const intake = req.body;
    const calories = yield openAIService_1.default.getCaloriesForIntakeItem(intake);
    res.send({
        status: "success",
        data: calories,
    });
}));
exports.getCaloriesForItem = getCaloriesForItem;
//# sourceMappingURL=calorieController.js.map