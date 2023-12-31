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
const mongoose_1 = __importStar(require("mongoose"));
const schemaOptions = {
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
};
const goalSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide a user id"],
    },
    date: {
        type: Date,
        required: [true, "Please provide a date"],
    },
    type: {
        type: String,
        enum: ["user", "week", "month", "day", "workout"],
        required: [true, "Please provide a type"],
    },
    description: {
        type: String,
    },
    userWeightLossGoal: {
        type: {
            startingWeight: { type: Number },
            weightGoal: { type: Number },
        },
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, schemaOptions);
goalSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this._id = new mongoose_1.default.Types.ObjectId();
        next();
    });
});
goalSchema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.type === "user") {
            if (!this.userWeightLossGoal) {
                next(new Error("Please provide a userWeightLossGoal"));
            }
            else {
                if (!this.userWeightLossGoal.startingWeight) {
                    next(new Error("Please provide a startingWeight"));
                }
                if (!this.userWeightLossGoal.weightGoal) {
                    next(new Error("Please provide a weightGoal"));
                }
            }
        }
        next();
    });
});
const GoalModel = mongoose_1.default.model("goal", goalSchema);
exports.default = GoalModel;
//# sourceMappingURL=goalModel.js.map