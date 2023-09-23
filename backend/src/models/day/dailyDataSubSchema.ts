import { Schema } from "mongoose";
import { MeasurementUnit } from "../../../../shared/types/intake";
import openAIService from "../../services/openAI/openAIService";
import intakeService from "../../services/intake/intakeService";
import { IIntakeItem } from "../../types/iTypes";

const intakeItemSchema = new Schema(
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
    timestamps: true,
  }
);

intakeItemSchema.pre("validate", async function (next) {
  try {
    const intakeItem = this.toObject() as IIntakeItem;
    const existingIntakeItem = await intakeService.getExistingIntakeItem(intakeItem);

    if (existingIntakeItem && existingIntakeItem.calories) {
      this.calories =
        existingIntakeItem.calories * (intakeItem.quantity / existingIntakeItem.quantity);
    } else {
      const calories = await openAIService.getCaloriesForIntakeItem(intakeItem);
      this.calories = calories;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  next();
});

const intakeSchema = new Schema(
  {
    name: {
      type: String,
    },
    items: {
      type: [intakeItemSchema],
      required: [true, "Please provide intake items"],
    },
  },
  {
    timestamps: true,
  }
);

export { intakeSchema };

// Path: src/models/day/dailyDataModel.ts
