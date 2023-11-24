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
exports.deleteGoal = exports.updateGoal = exports.createGoal = exports.getGoalById = exports.getGoals = void 0;
const goalModel_1 = __importDefault(require("../../models/goal/goalModel"));
const ALSService_1 = require("../../services/ALSService");
const errorService_1 = require("../../services/error/errorService");
const factoryService_1 = require("../../services/factory/factoryService");
const utilService_1 = require("../../services/util/utilService");
const getGoals = (0, factoryService_1.getAll)(goalModel_1.default);
exports.getGoals = getGoals;
const getGoalById = (0, factoryService_1.getOne)(goalModel_1.default);
exports.getGoalById = getGoalById;
const createGoal = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const doc = yield goalModel_1.default.create(Object.assign(Object.assign({}, req.body), { userId: loggedInUserId, date: new Date() }));
    res.status(201).send({
        status: "success",
        data: doc,
    });
}));
exports.createGoal = createGoal;
const updateGoal = (0, factoryService_1.updateOne)(goalModel_1.default, ["type", "description", "isCompleted"]);
exports.updateGoal = updateGoal;
const deleteGoal = (0, factoryService_1.deleteOne)(goalModel_1.default);
exports.deleteGoal = deleteGoal;
//# sourceMappingURL=goalController.js.map