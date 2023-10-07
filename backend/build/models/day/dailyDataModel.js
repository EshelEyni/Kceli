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
exports.DailyDataModel = void 0;
const mongoose_1 = require("mongoose");
const intakeSchema_1 = require("./intakeSchema");
const calorieService_1 = __importDefault(require("../../services/calorie/calorieService"));
const userModel_1 = require("../user/userModel");
const ALSService_1 = require("../../services/ALSService");
const workoutModel_1 = require("../workout/workoutModel");
const dailyDataSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        default: new Date(),
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: [true, "Please provide a user id"],
    },
    weight: {
        type: Number,
    },
    waist: {
        type: Number,
    },
    totalDailyEnergyExpenditure: {
        type: Number,
    },
    targetCaloricIntake: {
        type: Number,
    },
    intakes: {
        type: [intakeSchema_1.intakeSchema],
        default: [],
    },
    workouts: {
        type: [workoutModel_1.workoutSchema],
        default: [],
    },
}, {
    toObject: {
        virtuals: true,
        transform: (_, ret) => {
            delete ret._id;
            return ret;
        },
    },
    toJSON: {
        virtuals: true,
        transform: (_, ret) => {
            delete ret._id;
            return ret;
        },
    },
    timestamps: true,
});
dailyDataSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = this;
        if (!userId)
            return next();
        const latestEntry = yield DailyDataModel.findOne({ userId: userId }).sort({ date: -1 });
        if (!latestEntry)
            return next();
        const lastSavedDate = latestEntry.date;
        if (this.date.toDateString() !== lastSavedDate.toDateString())
            return next();
        const nextDay = new Date(lastSavedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.date = nextDay;
        next();
    });
});
dailyDataSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        const isWeightUpdated = update && "weight" in update;
        if (!isWeightUpdated)
            return next();
        const loggedInUserId = (0, ALSService_1.getLoggedInUserIdFromReq)();
        if (!loggedInUserId)
            return next();
        const user = yield userModel_1.UserModel.findById(loggedInUserId);
        if (!user)
            return next();
        const { height, gender, birthdate } = user;
        const { weight } = update;
        const age = new Date().getFullYear() - birthdate.getFullYear();
        const TDEE = calorieService_1.default.calcTotalDailyEnergyExpenditure({
            weight,
            height,
            age,
            gender,
        });
        const targetCaloricIntake = calorieService_1.default.calcTargetCaloricIntakePerDay({ TDEE });
        this.setOptions({ runValidators: true });
        this.updateOne({ totalDailyEnergyExpenditure: TDEE, targetCaloricIntake });
        next();
    });
});
const DailyDataModel = (0, mongoose_1.model)("DailyData", dailyDataSchema, "daily_data");
exports.DailyDataModel = DailyDataModel;
// Path: src/models/day/dailyDataSubSchema.ts
//# sourceMappingURL=dailyDataModel.js.map