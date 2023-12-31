import { User, UserDailyStatsResult } from "../../../../shared/types/user";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

const BASE_URL = "user";

async function query(): Promise<User[]> {
  const respose = await httpService.get(`user`);
  return handleServerResponseData<User[]>(respose);
}

async function getById(userId: string): Promise<User> {
  const respose = await httpService.get(`user/${userId}`);
  return handleServerResponseData<User>(respose);
}

async function getByUsername(username: string): Promise<User> {
  const respose = await httpService.get(`user/username/${username}`);
  return handleServerResponseData<User>(respose);
}

async function update(user: User): Promise<User> {
  const respose = await httpService.patch(`${BASE_URL}/loggedInUser`, user);
  return handleServerResponseData<User>(respose);
}

async function getUserDailyStats(): Promise<{ stats: UserDailyStatsResult[]; count: number }> {
  const respose = await httpService.get(`user/dailyStats`);
  return handleServerResponseData<{ stats: UserDailyStatsResult[]; count: number }>(respose);
}

export default { query, getById, getByUsername, update, getUserDailyStats };
