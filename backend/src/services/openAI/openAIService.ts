import { estimateFood, validateFoodItem, requestFoodResponse, validateFoodDescription } from "./foodEstimateService";
import { Configuration, OpenAIApi } from "openai";
import { AppError } from "../error/errorService";
import { IIntakeItem } from "../../types/iTypes";
import { IntakeItem } from "../../../../shared/types/intake";
import { User } from "../../../../shared/types/user";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getText(prompt: string): Promise<string> {
  validateFoodDescription(prompt);
  const data = await requestFoodResponse({
    instructions: "Answer everyday food and nutrition questions. Clearly label calorie values as estimates and state portion assumptions. Use the user's language.",
    input: prompt,
  });
  const content = Array.isArray(data.output) ? data.output.filter((o: any) => o.type === "message")
    .flatMap((o: any) => Array.isArray(o.content) ? o.content : []) : [];
  const answer = content.filter((c: any) => c.type === "output_text" && typeof c.text === "string")
    .map((c: any) => c.text).join("");
  if (!answer.trim() || content.some((c: any) => c.type === "refusal"))
    throw new AppError("Could not read the calorie estimate. Please try again or enter calories.", 502);
  return answer;
}

async function getCaloriesForIntakeItem(intakeItem: IIntakeItem | IntakeItem): Promise<number> {
  validateFoodItem(intakeItem);
  const { name, quantity, unit } = intakeItem;
  const result = await estimateFood(JSON.stringify({ food: name, quantity, unit }));
  return result.calories;
}

type getCalBurnParams = {
  user: User;
  workoutItem: CombinedWorkoutItem;
  weight?: number;
};

async function getCalorieBurnForWorkoutItem({ user, workoutItem, weight }: getCalBurnParams) {
  function getWorkoutItemPromptStr(workoutItem: CombinedWorkoutItem) {
    switch (workoutItem.type) {
      case "aerobic":
        return `Calculate calories burned for ${workoutItem.durationInMin} minutes of ${workoutItem.name}.`;
      case "anaerobic":
        return `Calculate calories burned for ${workoutItem.sets} sets of ${workoutItem.reps} reps of ${workoutItem.name} with ${workoutItem.weight} ${workoutItem.weightUnit}.`;
      case "superset":
        return `Calculate calories burned for ${workoutItem.sets} sets of ${workoutItem.items.length} reps of ${workoutItem.name} with ${workoutItem.items[0].weight} ${workoutItem.items[0].weightUnit}.`;
      default:
        throw new AppError("Invalid workoutItem type", 500);
    }
  }

  const { birthdate, weight: weightFromUser, height } = user;
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
  const prompt = `
  Calculate calories burned for ${age} year old ${
    weight || weightFromUser
  } lb ${height} in tall person.
  ${getWorkoutItemPromptStr(workoutItem)}
  NOTE: Return the number of calories as an integer.
  `;

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const { message } = completion.data.choices[0];
  if (!message) throw new AppError("message is falsey", 500);
  const text = message.content as string;
  const calories = parseInt(text);
  if (isNaN(calories)) throw new AppError("calories is NaN", 500);
  return Math.round(calories);
}

export default {
  getText,
  getCaloriesForIntakeItem,
  getCalorieBurnForWorkoutItem,
};
