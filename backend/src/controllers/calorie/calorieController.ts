import { Request, Response } from "express";
import { IntakeItem } from "../../../../shared/types/intake";
import openAIService from "../../services/openAI/openAIService";
import { asyncErrorCatcher } from "../../services/error/errorService";

const getCaloriesForItem = asyncErrorCatcher(async (req: Request, res: Response) => {
  const intake = req.body as unknown as IntakeItem;
  const calories = await openAIService.getCaloriesForIntakeItem(intake);
  res.send({
    status: "success",
    data: calories,
  });
});

export { getCaloriesForItem };
