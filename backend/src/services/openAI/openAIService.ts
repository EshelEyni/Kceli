import { Configuration, OpenAIApi } from "openai";
import { AppError } from "../error/errorService";
import { IIntakeItem } from "../../types/iTypes";
import { IntakeItem } from "../../../../shared/types/intake";

require("dotenv").config();

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getText(prompt: string): Promise<string> {
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
  const { message } = completion.data.choices[0];
  if (!message) throw new AppError("message is falsey", 500);
  return message.content as string;
}

async function getCaloriesForIntakeItem(intakeItem: IIntakeItem | IntakeItem): Promise<number> {
  const { name, quantity, unit } = intakeItem;
  const prompt = `
  Calculate calories for ${quantity} ${unit} of ${name}.
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
};
