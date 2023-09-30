"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.intakeSchema = void 0;
const mongoose_1 = require("mongoose");
const intake_1 = require("../../../../shared/dist/types/intake");
const openAIService_1 = __importDefault(require("../../services/openAI/openAIService"));
const intakeService_1 = __importDefault(require("../../services/intake/intakeService"));
const intakeItemSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    unit: {
      type: String,
      enum: intake_1.MeasurementUnit,
      required: [true, "Please provide a unit"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a quantity"],
    },
    calories: {
      type: Number,
      default: 0,
    },
  },
  {
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
  }
);
intakeItemSchema.pre("validate", function (next) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const intakeItem = this.toObject();
      if (intakeItem.calories) return next();
      const existingIntakeItem = yield intakeService_1.default.getExistingIntakeItem(intakeItem);
      if (existingIntakeItem && existingIntakeItem.calories) {
        this.calories =
          existingIntakeItem.calories * (intakeItem.quantity / existingIntakeItem.quantity);
      } else {
        const calories = yield openAIService_1.default.getCaloriesForIntakeItem(intakeItem);
        this.calories = calories;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    next();
  });
});
const intakeSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
    },
    items: {
      type: [intakeItemSchema],
      required: [true, "Please provide intake items"],
    },
    isRecorded: {
      type: Boolean,
      default: true,
    },
    recordedAt: {
      type: Date,
    },
  },
  {
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
  }
);
exports.intakeSchema = intakeSchema;
// Path: src/models/day/dailyDataModel.ts
//# sourceMappingURL=intakeSchema.js.map
