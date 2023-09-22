import { Configuration, OpenAIApi } from "openai";
import { AppError } from "../error/errorService";

require("dotenv").config();

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getTextFromOpenAI(prompt: string, model = "default"): Promise<string> {
  if (model === "gpt-4") {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    const { message } = completion.data.choices[0];
    if (!message) throw new AppError("message is falsey", 500);
    return message.content as string;
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 4000,
  });
  const { text } = completion.data.choices[0];
  if (!text) throw new AppError("text is falsey", 500);
  return text as string;
}

export default {
  getTextFromOpenAI,
};
