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
exports.queryUSDA = exports.queryNinjaAPI = exports.queryChatGPT = void 0;
const axios_1 = __importDefault(require("axios"));
const errorService_1 = require("../../services/error/errorService");
const openAIService_1 = __importDefault(require("../../services/openAI/openAIService"));
const queryChatGPT = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.query;
    if (!prompt)
        throw new errorService_1.AppError("Please provide prompt", 400);
    if (typeof prompt !== "string")
        throw new errorService_1.AppError("prompt must be a string", 400);
    const response = yield openAIService_1.default.getText(prompt);
    res.send({
        status: "success",
        data: response,
    });
}));
exports.queryChatGPT = queryChatGPT;
const queryNinjaAPI = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query)
        throw new errorService_1.AppError("Please provide query", 400);
    if (typeof query !== "string")
        throw new errorService_1.AppError("query must be a string", 400);
    const apiKey = process.env.NINJA_API_KEY;
    if (!apiKey)
        throw new errorService_1.AppError("NINJA_API_KEY is not defined", 500);
    const response = yield axios_1.default.get(`https://api.api-ninjas.com/v1/nutrition?query=${query}`, {
        headers: {
            "X-Api-Key": apiKey,
        },
    });
    res.send({
        status: "success",
        data: response.data,
    });
}));
exports.queryNinjaAPI = queryNinjaAPI;
const queryUSDA = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    if (!query)
        throw new errorService_1.AppError("Please provide query", 400);
    if (typeof query !== "string")
        throw new errorService_1.AppError("query must be a string", 400);
    const apiKey = process.env.USDA_NUTRIENTS_API_KEY;
    if (!apiKey)
        throw new errorService_1.AppError("USDA_API_KEY is not defined", 500);
    const response = yield axios_1.default.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=5`, {
        headers: {
            "X-Api-Key": apiKey,
        },
    });
    res.send({
        status: "success",
        data: response.data.foods,
    });
}));
exports.queryUSDA = queryUSDA;
//# sourceMappingURL=nutritionController.js.map