import { FavoriteIntake, Intake, NewIntake } from "../../../../shared/types/intake";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

async function getUserFavoriteIntakes() {
  const respose = await httpService.get(`intake/favorite`);
  return handleServerResponseData<FavoriteIntake[]>(respose);
}

async function addUserFavoriteIntake(intake: NewIntake | Intake) {
  const respose = await httpService.post(`intake/favorite`, intake);
  return handleServerResponseData<FavoriteIntake>(respose);
}

async function updateUserFavoriteIntake(intake: FavoriteIntake) {
  const respose = await httpService.patch(`intake/favorite/${intake.id}`, intake);
  return handleServerResponseData<FavoriteIntake>(respose);
}

async function removeUserFavoriteIntake(intakeId: string) {
  await httpService.delete(`intake/favorite/${intakeId}`);
}

export default {
  getUserFavoriteIntakes,
  addUserFavoriteIntake,
  updateUserFavoriteIntake,
  removeUserFavoriteIntake,
};
