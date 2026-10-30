import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

async function queryChatGPT(query: string) {
  const response = await httpService.get(`nutrition/chatGPT?prompt=${encodeURIComponent(query)}`);
  return handleServerResponseData<string>(response);
}

export default { queryChatGPT };
