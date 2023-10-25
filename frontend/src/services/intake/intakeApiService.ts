import { Intake } from "../../../../shared/types/intake";
import httpService from "../http/httpService";
import { handleServerResponseData } from "../util/utilService";

async function getUserFavoriteIntakes() {
  const respose = await httpService.get(`intake/favorite`);
  return handleServerResponseData<Intake[]>(respose);
}

async function addUserFavoriteIntake(intake: Intake) {
  const respose = await httpService.post(`intake/favorite`, intake);
  return handleServerResponseData<Intake>(respose);
}

async function updateUserFavoriteIntake(intake: Intake) {
  const respose = await httpService.patch(`intake/favorite/${intake.id}`, intake);
  return handleServerResponseData<Intake>(respose);
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
