import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";
import { Workout } from "../../../../shared/types/workout";

const BASE_URL = "workout";

async function query(): Promise<Workout[]> {
  const respose = await httpService.get(`${BASE_URL}`);
  return handleServerResponseData<Workout[]>(respose);
}

async function getById(workoutId: string): Promise<Workout> {
  const respose = await httpService.get(`${BASE_URL}/${workoutId}`);
  return handleServerResponseData<Workout>(respose);
}

async function create(workout: Workout): Promise<Workout> {
  const respose = await httpService.post(`${BASE_URL}`, workout);
  return handleServerResponseData<Workout>(respose);
}

async function update(workout: Workout): Promise<Workout> {
  const respose = await httpService.patch(`${BASE_URL}/${workout.id}`, workout);
  return handleServerResponseData<Workout>(respose);
}

async function remove(workoutId: string): Promise<void> {
  const respose = await httpService.delete(`${BASE_URL}/${workoutId}`);
  return handleServerResponseData<void>(respose);
}

export default { query, getById, create, update, remove };
