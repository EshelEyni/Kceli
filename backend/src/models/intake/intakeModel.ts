import mongoose, { Document, Schema } from "mongoose";
import { MeasurementUnit } from "../../../../shared/types/intake";
import openAIService from "../../services/openAI/openAIService";
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
  this.calories = await openAIService.getCaloriesForIntakeItem(this.toObject() as IIntakeItem);
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
