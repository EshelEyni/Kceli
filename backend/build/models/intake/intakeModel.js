"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
exports.intakeSchema = exports.FavoriteIntakeModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const intake_1 = require("../../../../shared/dist/types/intake");
const openAIService_1 = __importDefault(require("../../services/openAI/openAIService"));
const intakeService_1 = __importDefault(require("../../services/intake/intakeService"));
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
  schemaOptions
);
intakeItemSchema.pre("validate", function (next) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const intakeItem = this.toObject();
      if (intakeItem.calories || intakeItem.name.toLowerCase() === "water") return next();
      const existingItemData = yield intakeService_1.default.getExistingIntakeItem(intakeItem);
      if (existingItemData && existingItemData.calories) {
        this.calories =
          existingItemData.calories * (intakeItem.quantity / existingItemData.quantity);
      } else {
        this.calories = yield openAIService_1.default.getCaloriesForIntakeItem(intakeItem);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      next();
    }
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
    type: {
      type: String,
      enum: ["food", "drink"],
      default: "food",
    },
  },
  schemaOptions
);
exports.intakeSchema = intakeSchema;
const favoriteIntakeSchema = new mongoose_1.Schema(
  Object.assign(Object.assign({}, intakeSchema.obj), {
    userId: {
      type: mongoose_1.default.Schema.Types.ObjectId,
      required: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  }),
  schemaOptions
);
favoriteIntakeSchema.pre("save", function (next) {
  return __awaiter(this, void 0, void 0, function* () {
    this._id = new mongoose_1.default.Types.ObjectId();
    next();
  });
});
const FavoriteIntakeModel = mongoose_1.default.model(
  "FavoriteIntake",
  favoriteIntakeSchema,
  "favorite_intakes"
);
exports.FavoriteIntakeModel = FavoriteIntakeModel;
// Path: src/models/day/dailyDataModel.ts
//# sourceMappingURL=intakeModel.js.map
