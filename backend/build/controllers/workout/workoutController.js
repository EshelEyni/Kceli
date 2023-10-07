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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkout = exports.updateWorkout = exports.createWorkout = exports.getWorkout = exports.getAllWorkouts = void 0;
const workoutModel_1 = require("../../models/workout/workoutModel");
const factoryService_1 = require("../../services/factory/factoryService");
const errorService_1 = require("../../services/error/errorService");
const ALSService_1 = require("../../services/ALSService");
const utilService_1 = require("../../services/util/utilService");
const getAllWorkouts = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const docs = yield workoutModel_1.WorkoutModel.find({ userId: loggedInUserId });
    res.send({
        status: "success",
        results: docs.length,
        data: docs,
    });
}));
exports.getAllWorkouts = getAllWorkouts;
const getWorkout = (0, factoryService_1.getOne)(workoutModel_1.WorkoutModel);
exports.getWorkout = getWorkout;
const createWorkout = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const workout = req.body;
    const doc = yield workoutModel_1.WorkoutModel.create(Object.assign(Object.assign({}, workout), { userId: loggedInUserId }));
    res.status(201).send({
        status: "success",
        data: doc,
    });
}));
exports.createWorkout = createWorkout;
const updateWorkout = (0, factoryService_1.updateOne)(workoutModel_1.WorkoutModel, ["description", "items"]);
exports.updateWorkout = updateWorkout;
const deleteWorkout = (0, factoryService_1.deleteOne)(workoutModel_1.WorkoutModel);
exports.deleteWorkout = deleteWorkout;
//# sourceMappingURL=workoutController.js.map