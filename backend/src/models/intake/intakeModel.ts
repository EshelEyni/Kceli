import mongoose, { Document, Schema } from "mongoose";
import { MeasurementUnit } from "../../../../shared/types/intake";
import openAIService from "../../services/openAI/openAIService";
import { findFoodInHistory } from "../../services/intake/foodEstimateHistoryService";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { validateFoodItem } from "../../services/openAI/foodEstimateService";
import { IFavoriteIntake, IIntake, IIntakeItem } from "../../types/iTypes";

const schemaOptions = {
  toObject: {
    virtuals: true,
    transform: (_: Document, ret: Record<string, unknown>) => {
      delete ret._id;
      return ret;
    },
  },
  toJSON: {
    virtuals: true,
    transform: (_: Document, ret: Record<string, unknown>) => {
      delete ret._id;
      return ret;
    },
  },
};

const intakeItemSchema = new Schema<IIntakeItem>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    unit: {
      type: String,
      enum: MeasurementUnit,
      required: [true, "Please provide a unit"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a quantity"],
    },
    calories: {
      type: Number,
      min: 0,
    },
  },
  schemaOptions
);

intakeItemSchema.pre("validate", async function () {
  if (this.calories !== undefined && this.calories !== null) return;
  const item = this.toObject() as IIntakeItem;
  validateFoodItem(item);
  const saved = await findFoodInHistory(item.name, getLoggedInUserIdFromReq(), item);
  this.calories = saved?.calories ?? await openAIService.getCaloriesForIntakeItem(item);
});

const intakeSchema = new Schema<IIntake>(
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

const favoriteIntakeSchema = new Schema<IFavoriteIntake>(
  {
    ...(intakeSchema.obj as IIntake),
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a user id"],
    },
    sortOrder: {
      type: Number,
      min: 0,
    },
  },
  schemaOptions
);

favoriteIntakeSchema.pre("save", async function (next) {
  this._id = new mongoose.Types.ObjectId();
  next();
});

const FavoriteIntakeModel = mongoose.model(
  "FavoriteIntake",
  favoriteIntakeSchema,
  "favorite_intakes"
);

export { FavoriteIntakeModel, intakeSchema };

// Path: src/models/day/dailyDataModel.ts
