import { FormattedNinjaAPIResData, FormattedUSDAFoodObject } from "../../../../shared/types/system";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

const BASR_URL = "nutrition";

async function queryChatGPT(query: string) {
  const respose = await httpService.get(`${BASR_URL}/chatGPT?prompt=${query}`);
  return handleServerResponseData<string>(respose);
}

async function queryNinja(query: string) {
  const respose = await httpService.get(`${BASR_URL}/ninja?query=${query}`);
  return handleServerResponseData<FormattedNinjaAPIResData>(respose);
}

async function queryUSDA(query: string) {
  const respose = await httpService.get(`${BASR_URL}/usda?query=${query}`);
  return handleServerResponseData<FormattedUSDAFoodObject[]>(respose);
}

export default { queryChatGPT, queryNinja, queryUSDA };
