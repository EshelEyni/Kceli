import { asyncErrorCatcher } from "../../services/error/errorService";
import openAIService from "../../services/openAI/openAIService";
import { validateFoodItem } from "../../services/openAI/foodEstimateService";

const getCaloriesForItem = asyncErrorCatcher(async (req, res) => {
  validateFoodItem(req.body);
  // A previous user's entry is not a trustworthy nutrition database.
  const calories = await openAIService.getCaloriesForIntakeItem(req.body);
  res.set("Cache-Control", "no-store").send({ status: "success", data: calories });
});
export { getCaloriesForItem };
