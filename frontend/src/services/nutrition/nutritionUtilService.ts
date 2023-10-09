import { NutritionQueryState } from "../../types/app";

function getDefaultNutritionQuery(type: NutritionQueryState["type"]): NutritionQueryState {
  return {
    type,
    response: null,
    status: "idle",
    error: null,
  };
}

export default { getDefaultNutritionQuery };
