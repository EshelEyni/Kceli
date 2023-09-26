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
exports.removeDay = exports.updateDay = exports.getToday = exports.getDay = exports.getAllDays = void 0;
const dailyDataModel_1 = require("../../models/day/dailyDataModel");
const ALSService_1 = require("../../services/ALSService");
const errorService_1 = require("../../services/error/errorService");
const factoryService_1 = require("../../services/factory/factoryService");
const utilService_1 = require("../../services/util/utilService");
const getAllDays = (0, factoryService_1.getAll)(dailyDataModel_1.DailyDataModel);
exports.getAllDays = getAllDays;
const getDay = (0, factoryService_1.getOne)(dailyDataModel_1.DailyDataModel);
exports.getDay = getDay;
const getToday = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const currDate = new Date();
    const doc = yield dailyDataModel_1.DailyDataModel.findOne({
        userId: loggedInUserId,
        date: {
            $gte: currDate.setHours(0, 0, 0, 0),
            $lt: currDate.setHours(23, 59, 59, 999),
        },
    });
    if (!doc) {
        const newDoc = yield dailyDataModel_1.DailyDataModel.create({ userId: loggedInUserId });
        res.status(201).send({
            status: "success",
            data: newDoc,
        });
    }
    else {
        res.send({
            status: "success",
            data: doc,
        });
    }
}));
exports.getToday = getToday;
const updateDay = (0, factoryService_1.updateOne)(dailyDataModel_1.DailyDataModel, ["intakes", "weight", "waist"]);
exports.updateDay = updateDay;
const removeDay = (0, factoryService_1.deleteOne)(dailyDataModel_1.DailyDataModel);
exports.removeDay = removeDay;
//# sourceMappingURL=dayController.js.map