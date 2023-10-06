import { Document, Schema } from "mongoose";
import { MeasurementUnit } from "../../../../shared/types/intake";
import openAIService from "../../services/openAI/openAIService";
import intakeService from "../../services/intake/intakeService";
import { IIntake, IIntakeItem } from "../../types/iTypes";

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
      default: 0,
    },
  },
  {
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
  }
);

intakeItemSchema.pre("validate", async function (next) {
  try {
    const intakeItem = this.toObject() as IIntakeItem;
    if (intakeItem.calories) return next();
    const existingItemData = await intakeService.getExistingIntakeItem(intakeItem);

    if (existingItemData && existingItemData.calories) {
      this.calories = existingItemData.calories * (intakeItem.quantity / existingItemData.quantity);
    } else {
      this.calories = await openAIService.getCaloriesForIntakeItem(intakeItem);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    next();
  }
});

const intakeSchema = new Schema<IIntake>(
  {
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
  }
);

export { intakeSchema };

// Path: src/models/day/dailyDataModel.ts
