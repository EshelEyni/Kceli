import axios from "axios";
import { AppError, asyncErrorCatcher } from "../../services/error/errorService";
import openAIService from "../../services/openAI/openAIService";
import { NinjaAPIResData, NinjaAPIResDataItem, USDAFoodObject } from "../../types/app";
import {
  FormattedNinjaAPIResData,
  FormattedNinjaAPIResDataItem,
  FormattedUSDAFoodObject,
} from "../../../../shared/types/system";

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
    headers: { "X-Api-Key": apiKey },
  });

  res.send({
    status: "success",
    data: formatNinjaAPIResData(response.data),
  });
});

const queryUSDA = asyncErrorCatcher(async (req, res) => {
  const { query } = req.query;
  if (!query) throw new AppError("Please provide query", 400);
  if (typeof query !== "string") throw new AppError("query must be a string", 400);
  const apiKey = process.env.USDA_NUTRIENTS_API_KEY;
  if (!apiKey) throw new AppError("USDA_API_KEY is not defined", 500);

  const response = await axios.get(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=8`,
    { headers: { "X-Api-Key": apiKey } }
  );

  res.send({
    status: "success",
    data: formatUSDAAPIData(response.data),
  });
});

function formatNinjaAPIResData(data: NinjaAPIResData): FormattedNinjaAPIResData {
  function formatUnit(unit: string | undefined) {
    if (!unit) return null;
    const isTotalG = unit === "_total_g";
    return isTotalG ? " Total Gram" : unit.replace(/_/g, " ").trimStart().toUpperCase();
  }

  const unitRegex = /_g|_mg|_total_g/g;

  return data.map((item: NinjaAPIResDataItem) => {
    const entries = Object.entries(item);

    return entries
      .filter(([_, value]) => value !== 0)
      .reduce((acc, [key, value]) => {
        // if (typeof value !== "number") return acc;

        const formattedKey = key.replace(unitRegex, "").replace(/_/g, " ");
        const unit = key.match(unitRegex)?.[0];
        const formattedUnit = formatUnit(unit);
        const formattedValue = formattedUnit ? `${value}${formattedUnit}` : `${value}`;

        return { ...acc, [formattedKey]: formattedValue };
      }, {} as FormattedNinjaAPIResDataItem);
  });
}

function formatUSDAAPIData(data: { foods: USDAFoodObject[] }): FormattedUSDAFoodObject[] {
  return data.foods.map(item => {
    const { description, servingSize, servingSizeUnit, foodNutrients } = item;
    const formattedNutrients = foodNutrients.reduce((acc, curr, i, arr) => {
      const { nutrientName, unitName, value } = curr;
      if (i === 0) {
        const energy = arr.find(n => n.nutrientName === "Energy");
        if (energy) {
          const { value: energyValue, unitName: energyUnitName } = energy;
          acc = { Energy: `${energyValue} ${energyUnitName}` };
        }
      }

      if (Number(value) >= 1 && nutrientName !== "Energy") {
        acc[nutrientName] = `${value} ${unitName}`;
      }

      return acc;
    }, {} as Record<string, string>);

    const formattedFood: FormattedUSDAFoodObject = {
      description,
      ...formattedNutrients,
    };
    if (servingSize) formattedFood.servingSize = `${servingSize} ${servingSizeUnit}`;

    return formattedFood;
  });
}

export { queryChatGPT, queryNinjaAPI, queryUSDA, formatNinjaAPIResData, formatUSDAAPIData };
