import { DayData } from "../../../../shared/types/dayData";
import { AddIntakeParams } from "../../types/app";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

async function query() {
  const respose = await httpService.get("day");
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

async function addIntake({ todayDataId, intakes }: AddIntakeParams) {
  console.log("addIntake", { todayDataId, intakes });
  const respose = await httpService.patch(`day/${todayDataId}`, { intakes });
  return handleServerResponseData<DayData>(respose);
}

export default { query, getById, getToday, update, addIntake };
