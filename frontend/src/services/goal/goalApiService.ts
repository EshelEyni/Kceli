import { Goal, UserGoal } from "../../types/app";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

const BASE_URL = "goal";

async function getGoals(queryString: string) {
  const url = `${BASE_URL}${queryString}`;
  const respose = await httpService.get(url);
  return handleServerResponseData<Goal[]>(respose);
}

async function getGoal(id: string) {
  const respose = await httpService.get(`${BASE_URL}/${id}`);
  return handleServerResponseData<Goal>(respose);
}

async function getUserGoal() {
  const respose = await httpService.get(`${BASE_URL}/user`);
  return handleServerResponseData<UserGoal>(respose);
}

async function addGoal(goal: Partial<Goal>) {
  const respose = await httpService.post(`${BASE_URL}`, goal);
  return handleServerResponseData<Goal>(respose);
}

async function updateGoal(goal: Partial<Goal>) {
  const respose = await httpService.patch(`${BASE_URL}/${goal.id}`, goal);
  return handleServerResponseData<Goal>(respose);
}

async function deleteGoal(id: string) {
  const respose = await httpService.delete(`${BASE_URL}/${id}`);
  return handleServerResponseData<Goal>(respose);
}

export default { getGoals, getGoal, getUserGoal, addGoal, updateGoal, deleteGoal };
