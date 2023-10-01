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
exports.getUserDailyStats = exports.removeLoggedInUser = exports.updateLoggedInUser = exports.removeUser = exports.updateUser = exports.addUser = exports.getUserByUsername = exports.getUserById = exports.getUsers = void 0;
const userService_1 = __importDefault(require("../../services/user/userService"));
const errorService_1 = require("../../services/error/errorService");
const factoryService_1 = require("../../services/factory/factoryService");
const userModel_1 = require("../../models/user/userModel");
const ALSService_1 = require("../../services/ALSService");
const utilService_1 = require("../../services/util/utilService");
const dailyDataModel_1 = require("../../models/day/dailyDataModel");
const getUsers = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = req.query;
    const users = yield userService_1.default.query(queryString);
    res.send({
        status: "success",
        requestedAt: new Date().toISOString(),
        results: users.length,
        data: users,
    });
}));
exports.getUsers = getUsers;
const getUserById = (0, factoryService_1.getOne)(userModel_1.UserModel);
exports.getUserById = getUserById;
const addUser = (0, factoryService_1.createOne)(userModel_1.UserModel);
exports.addUser = addUser;
const updateUser = (0, factoryService_1.updateOne)(userModel_1.UserModel, [
    "username",
    "email",
    "fullname",
    "imgUrl",
    "email",
    "isApprovedLocation",
    "bio",
]);
exports.updateUser = updateUser;
const removeUser = (0, factoryService_1.deleteOne)(userModel_1.UserModel);
exports.removeUser = removeUser;
const getUserByUsername = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    if (!username)
        throw new errorService_1.AppError("No user username provided", 400);
    const user = yield userService_1.default.getByUsername(username);
    res.send({
        status: "success",
        requestedAt: new Date().toISOString(),
        data: user,
    });
}));
exports.getUserByUsername = getUserByUsername;
const updateLoggedInUser = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userToUpdate = req.body;
    (0, errorService_1.validatePatchRequestBody)(userToUpdate);
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    if (!loggedInUserId)
        throw new errorService_1.AppError("User not logged in", 401);
    const updatedUser = yield userService_1.default.update(loggedInUserId, userToUpdate);
    res.send({
        status: "success",
        data: updatedUser,
    });
}));
exports.updateLoggedInUser = updateLoggedInUser;
const removeLoggedInUser = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    if (!loggedInUserId)
        throw new errorService_1.AppError("User not logged in", 401);
    yield userService_1.default.removeAccount(loggedInUserId);
    res.status(204).send({
        status: "success",
        data: null,
    });
}));
exports.removeLoggedInUser = removeLoggedInUser;
const getUserDailyStats = (0, errorService_1.asyncErrorCatcher)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
    (0, utilService_1.validateIds)({ id: loggedInUserId, entityName: "loggedInUser" });
    const docs = yield dailyDataModel_1.DailyDataModel.find({ userId: loggedInUserId, weight: { $ne: null }, waist: { $ne: null } }, { date: 1, weight: 1, waist: 1 }).sort({
        date: 1,
    });
    res.send({
        status: "success",
        data: docs,
    });
}));
exports.getUserDailyStats = getUserDailyStats;
//# sourceMappingURL=userController.js.map