import { Request, Response } from "express";
import { IntakeItem } from "../../../../shared/types/intake";
import { AppError, asyncErrorCatcher } from "../../services/error/errorService";
import openAIService from "../../services/openAI/openAIService";
import intakeService from "../../services/intake/intakeService";
import calorieService from "../../services/calorie/calorieService";

const getCaloriesForItem = asyncErrorCatcher(async (req: Request, res: Response) => {
  const intakeItem = req.body as unknown as IntakeItem;
  const isEmptyBody = Object.keys(intakeItem).length === 0;
  if (isEmptyBody) throw new AppError("Empty body provided", 400);
  const existingItemData = await intakeService.getExistingIntakeItem(intakeItem);
  let calories;

  if (existingItemData && existingItemData.calories) {
    calories = calorieService.calcCaloriesFromExistingItem({ existingItemData, intakeItem });
  } else {
    calories = await openAIService.getCaloriesForIntakeItem(intakeItem);
  }

  res.send({
    status: "success",
    data: calories,
  });
});

export { getCaloriesForItem };
