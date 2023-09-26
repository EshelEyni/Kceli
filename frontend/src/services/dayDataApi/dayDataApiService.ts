import { DayData } from "../../../../shared/types/dayData";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

async function query(queryObj: Record<string, string>) {
  const queryString = new URLSearchParams(queryObj).toString();
  const url = `day?${queryString || ""}`;
  const respose = await httpService.get(url);
  return handleServerResponseData<DayData[]>(respose);
}

async function getById(dayId: string) {
  const respose = await httpService.get(`day/${dayId}`);
  return handleServerResponseData<DayData>(respose);
}

async function getToday() {
  const respose = await httpService.get(`day/today`);
  return handleServerResponseData<DayData>(respose);
}

async function update(dayData: DayData) {
  const respose = await httpService.patch(`day/${dayData.id}`, dayData);
  return handleServerResponseData<DayData>(respose);
}

export default { query, getById, getToday, update };
