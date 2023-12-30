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
exports.removeFavoriteIntake = exports.updateFavoriteIntake = exports.createFavoriteIntake = exports.getUserFavoriteIntakes = void 0;
const intakeModel_1 = require("../../models/intake/intakeModel");
const ALSService_1 = require("../../services/ALSService");
const errorService_1 = require("../../services/error/errorService");
const utilService_1 = require("../../services/util/utilService");
const factoryService_1 = require("../../services/factory/factoryService");
const getUserFavoriteIntakes = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const docs = yield intakeModel_1.FavoriteIntakeModel.find({ userId: loggedInUserId }).sort("-sortOrder");
    res.send({
        status: "success",
        requestedAt: new Date().toISOString(),
        results: docs.length,
        data: docs,
    });
}));
exports.getUserFavoriteIntakes = getUserFavoriteIntakes;
const createFavoriteIntake = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const doc = yield intakeModel_1.FavoriteIntakeModel.create(Object.assign(Object.assign({}, req.body), { userId: loggedInUserId }));
    res.status(201).send({
        status: "success",
        data: doc,
    });
}));
exports.createFavoriteIntake = createFavoriteIntake;
const updateFavoriteIntake = (0, factoryService_1.updateOne)(intakeModel_1.FavoriteIntakeModel, [
    "items",
    "isRecorded",
    "recordedAt",
    "sortOrder",
    "type",
]);
exports.updateFavoriteIntake = updateFavoriteIntake;
const removeFavoriteIntake = (0, factoryService_1.deleteOne)(intakeModel_1.FavoriteIntakeModel);
exports.removeFavoriteIntake = removeFavoriteIntake;
//# sourceMappingURL=intakeController.js.map