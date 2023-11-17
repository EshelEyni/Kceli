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
exports.removeDay = exports.updateDay = exports.createDay = exports.getToday = exports.getDay = exports.getCalenderData = exports.getAllDays = void 0;
const dailyDataModel_1 = require("../../models/day/dailyDataModel");
const ALSService_1 = require("../../services/ALSService");
const errorService_1 = require("../../services/error/errorService");
const factoryService_1 = require("../../services/factory/factoryService");
const utilService_1 = require("../../services/util/utilService");
const date_fns_1 = require("date-fns");
const getAllDays = (0, factoryService_1.getAll)(dailyDataModel_1.DailyDataModel);
exports.getAllDays = getAllDays;
const getCalenderData = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const { month, year } = req.query;
    if (!month || !year)
        throw new Error("Please provide month and year");
    const startCurrentMonth = (0, date_fns_1.startOfMonth)(new Date(Number(year), Number(month) - 1));
    const endCurrentMonth = (0, date_fns_1.endOfMonth)(new Date(Number(year), Number(month) - 1));
    const startPrevMonth = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(startCurrentMonth, 1));
    const endNextMonth = (0, date_fns_1.endOfMonth)((0, date_fns_1.addMonths)(endCurrentMonth, 1));
    const docs = yield dailyDataModel_1.DailyDataModel.find({
        userId: loggedInUserId,
        date: {
            $gte: startPrevMonth,
            $lt: endNextMonth,
        },
    }).sort({ date: -1 });
    res.send({
        status: "success",
        requestedAt: new Date().toISOString(),
        results: docs.length,
        data: docs,
    });
}));
exports.getCalenderData = getCalenderData;
const getDay = (0, factoryService_1.getOne)(dailyDataModel_1.DailyDataModel);
exports.getDay = getDay;
const createDay = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const { date } = req.body;
    if (!date)
        throw new errorService_1.AppError("Please provide date", 400);
    const doc = yield dailyDataModel_1.DailyDataModel.create(Object.assign(Object.assign({}, req.body), { date: new Date(date), userId: loggedInUserId }));
    res.status(201).send({
        status: "success",
        data: doc,
    });
}));
exports.createDay = createDay;
const getToday = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const doc = yield dailyDataModel_1.DailyDataModel.findOne({ userId: loggedInUserId }).sort({ date: -1 }).limit(1);
    if (!doc) {
        const date = (0, utilService_1.getIsraeliDate)();
        const doc = yield dailyDataModel_1.DailyDataModel.create({
            date,
            userId: loggedInUserId,
        });
        res.status(201).send({
            status: "success",
            data: doc,
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
const updateDay = (0, factoryService_1.updateOne)(dailyDataModel_1.DailyDataModel, [
    "intakes",
    "weight",
    "waist",
    "workouts",
    "isWeightWaistIgnored",
]);
exports.updateDay = updateDay;
const removeDay = (0, factoryService_1.deleteOne)(dailyDataModel_1.DailyDataModel);
exports.removeDay = removeDay;
//# sourceMappingURL=dayController.js.map