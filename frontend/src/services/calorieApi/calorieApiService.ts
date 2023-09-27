import { NewIntakeItem } from "../../../../shared/types/intake";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

const BASE_URL = "calorie";

async function getCaloriesForItem(item: NewIntakeItem) {
  const respose = await httpService.post(`${BASE_URL}/item`, item);
  return handleServerResponseData<number>(respose);
}

export default { getCaloriesForItem };
