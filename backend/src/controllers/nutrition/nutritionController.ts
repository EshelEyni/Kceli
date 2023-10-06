import axios from "axios";
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

const queryNinjaAPI = asyncErrorCatcher(async (req, res) => {
  const { query } = req.query;
  if (!query) throw new AppError("Please provide query", 400);
  if (typeof query !== "string") throw new AppError("query must be a string", 400);
  const apiKey = process.env.NINJA_API_KEY;
  if (!apiKey) throw new AppError("NINJA_API_KEY is not defined", 500);

  const response = await axios.get(`https://api.api-ninjas.com/v1/nutrition?query=${query}`, {
    headers: {
      "X-Api-Key": apiKey,
    },
  });

  res.send({
    status: "success",
    data: response.data,
  });
});

const queryUSDA = asyncErrorCatcher(async (req, res) => {
  const { query } = req.query;
  if (!query) throw new AppError("Please provide query", 400);
  if (typeof query !== "string") throw new AppError("query must be a string", 400);
  const apiKey = process.env.USDA_NUTRIENTS_API_KEY;
  if (!apiKey) throw new AppError("USDA_API_KEY is not defined", 500);

  const response = await axios.get(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=5`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    }
  );

  res.send({
    status: "success",
    data: response.data.foods,
  });
});

export { queryChatGPT, queryNinjaAPI, queryUSDA };
