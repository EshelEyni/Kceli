import { AppError, asyncErrorCatcher } from "../../services/error/errorService";
import openAIService from "../../services/openAI/openAIService";

const queryChatGPT = asyncErrorCatcher(async (req, res) => {
  const { prompt } = req.query;
  if (!prompt) throw new AppError("Please provide prompt", 400);
  if (typeof prompt !== "string") throw new AppError("prompt must be a string", 400);

  const response = await openAIService.getText(prompt);
  res.send({
    status: "success",
    data: response,
  });
});

export { queryChatGPT };
