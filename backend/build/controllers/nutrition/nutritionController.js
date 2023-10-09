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
exports.formatUSDAAPIData = exports.formatNinjaAPIResData = exports.queryUSDA = exports.queryNinjaAPI = exports.queryChatGPT = void 0;
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
        headers: { "X-Api-Key": apiKey },
    });
    res.send({
        status: "success",
        data: formatNinjaAPIResData(response.data),
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
    const response = yield axios_1.default.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=8`, { headers: { "X-Api-Key": apiKey } });
    res.send({
        status: "success",
        data: formatUSDAAPIData(response.data),
    });
}));
exports.queryUSDA = queryUSDA;
function formatNinjaAPIResData(data) {
    function formatUnit(unit) {
        if (!unit)
            return null;
        const isTotalG = unit === "_total_g";
        return isTotalG ? " Total Gram" : unit.replace(/_/g, " ").trimStart().toUpperCase();
    }
    const unitRegex = /_g|_mg|_total_g/g;
    return data.map((item) => {
        const entries = Object.entries(item);
        return entries
            .filter(([_, value]) => value !== 0)
            .reduce((acc, [key, value]) => {
            // if (typeof value !== "number") return acc;
            var _a;
            const formattedKey = key.replace(unitRegex, "").replace(/_/g, " ");
            const unit = (_a = key.match(unitRegex)) === null || _a === void 0 ? void 0 : _a[0];
            const formattedUnit = formatUnit(unit);
            const formattedValue = formattedUnit ? `${value}${formattedUnit}` : `${value}`;
            return Object.assign(Object.assign({}, acc), { [formattedKey]: formattedValue });
        }, {});
    });
}
exports.formatNinjaAPIResData = formatNinjaAPIResData;
function formatUSDAAPIData(data) {
    return data.foods.map(item => {
        const { description, servingSize, servingSizeUnit, foodNutrients } = item;
        const formattedNutrients = foodNutrients.reduce((acc, curr, i, arr) => {
            const { nutrientName, unitName, value } = curr;
            if (i === 0) {
                const energy = arr.find(n => n.nutrientName === "Energy");
                if (energy) {
                    const { value: energyValue, unitName: energyUnitName } = energy;
                    acc = { Energy: `${energyValue} ${energyUnitName}` };
                }
            }
            if (Number(value) >= 1 && nutrientName !== "Energy") {
                acc[nutrientName] = `${value} ${unitName}`;
            }
            return acc;
        }, {});
        const formattedFood = Object.assign({ description }, formattedNutrients);
        if (servingSize)
            formattedFood.servingSize = `${servingSize} ${servingSizeUnit}`;
        return formattedFood;
    });
}
exports.formatUSDAAPIData = formatUSDAAPIData;
//# sourceMappingURL=nutritionController.js.map