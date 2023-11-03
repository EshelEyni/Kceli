"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutModel = exports.workoutSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const workout_1 = require("../../../../shared/types/workout");
const errorService_1 = require("../../services/error/errorService");
function validateAerobicFields(value) {
    if (value !== "aerobic")
        return true;
    if (!this.durationInMin)
        throw new errorService_1.AppError("Duration is required for aerobic type", 400);
    return true;
}
function validateAnaerobicFields(value) {
    if (value !== "anaerobic")
        return true;
    if (!this.sets)
        throw new errorService_1.AppError("Sets are required for anaerobic type", 400);
    if (!this.reps)
        throw new errorService_1.AppError("Reps are required for anaerobic type", 400);
    if (!this.weight)
        throw new errorService_1.AppError("Weight is required for anaerobic type", 400);
    if (!this.weightUnit)
        throw new errorService_1.AppError("WeightUnit is required for anaerobic type", 400);
    if (!this.restInSec)
        throw new errorService_1.AppError("RestInSec is required for anaerobic type", 400);
    return true;
}
function validateSupersetFields(value) {
    if (value !== "superset")
        return true;
    if (!this.sets)
        throw new errorService_1.AppError("Sets are required for superset type", 400);
    if (!this.restInSec)
        throw new errorService_1.AppError("RestInSec is required for superset type", 400);
    if (!this.items)
        throw new errorService_1.AppError("Items are required for superset type", 400);
    return true;
}
const workoutItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name for the workout item"],
    },
    isStarted: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: {
            values: ["aerobic", "anaerobic", "superset"],
            message: "type must be either aerobic, anaerobic or superset",
        },
        default: "anaerobic",
        validate: [
            { validator: validateAerobicFields },
            { validator: validateAnaerobicFields },
            { validator: validateSupersetFields },
        ],
    },
    durationInMin: Number,
    sets: {
        type: Number,
        default: undefined,
    },
    reps: {
        type: Number,
        default: undefined,
    },
    weight: {
        type: Number,
        default: undefined,
    },
    weightUnit: {
        type: String,
        enum: {
            values: Object.values(workout_1.WeightUnit),
            message: "weightUnit must be either kg or lbs",
        },
        default: undefined,
    },
    restInSec: {
        type: Number,
        default: undefined,
    },
    items: {
        type: [
            {
                name: {
                    type: String,
                    required: [true, "Please provide a name for the superset item"],
                },
                reps: {
                    type: Number,
                    required: [true, "Please provide a reps for the superset item"],
                },
                weight: {
                    type: Number,
                    required: [true, "Please provide a weight for the superset item"],
                },
                weightUnit: {
                    type: String,
                    enum: {
                        values: Object.values(workout_1.WeightUnit),
                        message: `weightUnit must be either ${Object.values(workout_1.WeightUnit).join(", ")} `,
                    },
                    required: [true, "Please provide a weightUnit for the superset item"],
                },
            },
        ],
        default: undefined,
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
});
const workoutSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Please provide a userId"],
    },
    type: {
        type: String,
        enum: {
            values: ["aerobic", "anaerobic"],
            message: "type must be either aerobic or anaerobic",
        },
        default: "anaerobic",
    },
    split: {
        type: String,
        enum: {
            values: ["FBW", "A", "B", "C", "D", "E", "F"],
            message: "split must be either FBW, A, B, C, D, E or F",
        },
        default: "FBW",
    },
    description: {
        type: String,
        trim: true,
        default: "no description",
    },
    items: [workoutItemSchema],
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
});
exports.workoutSchema = workoutSchema;
const WorkoutModel = mongoose_1.default.model("workouts", workoutSchema);
exports.WorkoutModel = WorkoutModel;
//# sourceMappingURL=workoutModel.js.map