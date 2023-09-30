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
const workoutItemAnaerobicSchema = new mongoose_1.Schema({
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    weightUnit: {
        type: String,
        enum: ["kg", "lbs"],
    },
    isStarted: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    setCompletedStatus: {
        type: [Boolean],
        default: [],
    },
    restInSec: Number,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workoutItemAerobicSchema = new mongoose_1.Schema({
    name: String,
    durationInMin: Number,
    isStarted: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const workoutItemSupersetSchema = new mongoose_1.Schema({
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    weightUnit: {
        type: String,
        enum: ["kg", "lbs"],
    },
    restInSec: Number,
    isStarted: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    superset: [workoutItemAnaerobicSchema],
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
    type: {
        type: String,
        enum: ["aerobic", "anaerobic"],
        default: "anaerobic",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Please provide a userId"],
    },
    split: {
        type: String,
        enum: ["FBW", "A", "B", "C", "D", "E", "F"],
        default: "FBW",
    },
    description: {
        type: String,
        trim: true,
        default: "no description",
    },
    items: [
        {
            type: mongoose_1.default.Schema.Types.Mixed,
            enum: [workoutItemAnaerobicSchema, workoutItemAerobicSchema, workoutItemSupersetSchema],
        },
    ],
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