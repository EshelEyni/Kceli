import { Request, Response } from "express";
import userService from "../../services/user/userService";
import {
  asyncErrorCatcher,
  AppError,
  validatePatchRequestBody,
} from "../../services/error/errorService";
import {
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAll,
} from "../../services/factory/factoryService";
import { UserModel } from "../../models/user/userModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { validateIds } from "../../services/util/utilService";
import { DailyDataModel } from "../../models/day/dailyDataModel";

const getUsers = getAll(UserModel);

const getUserById = getOne(UserModel);
const addUser = createOne(UserModel);
const updateUser = updateOne(UserModel, [
  "username",
  "email",
  "fullname",
  "imgUrl",
  "email",
  "isApprovedLocation",
  "bio",
  "workoutSchedule",
  "targetCaloricDeficitPerDay",
]);
const removeUser = deleteOne(UserModel);

const getUserByUsername = asyncErrorCatcher(async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) throw new AppError("No user username provided", 400);
  const user = await userService.getByUsername(username);

  res.send({
    status: "success",
    requestedAt: new Date().toISOString(),
    data: user,
  });
});

const updateLoggedInUser = asyncErrorCatcher(async (req: Request, res: Response): Promise<void> => {
  const userToUpdate = req.body;
  validatePatchRequestBody(userToUpdate);
  const loggedInUserId = getLoggedInUserIdFromReq();
  if (!loggedInUserId) throw new AppError("User not logged in", 401);
  const updatedUser = await userService.update(loggedInUserId, userToUpdate);

  res.send({
    status: "success",
    data: updatedUser,
  });
});

const removeLoggedInUser = asyncErrorCatcher(async (req: Request, res: Response): Promise<void> => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  if (!loggedInUserId) throw new AppError("User not logged in", 401);

  await userService.removeAccount(loggedInUserId);

  res.status(204).send({
    status: "success",
    data: null,
  });
});

const getUserDailyStats = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const stats = await DailyDataModel.find(
    { userId: loggedInUserId, weight: { $ne: null }, waist: { $ne: null } },
    { date: 1, weight: 1, waist: 1 }
  ).sort({
    date: 1,
  });

  const count = await DailyDataModel.countDocuments({ userId: loggedInUserId });

  res.send({
    status: "success",
    data: { count, stats },
  });
});

export {
  getUsers,
  getUserById,
  getUserByUsername,
  addUser,
  updateUser,
  removeUser,
  updateLoggedInUser,
  removeLoggedInUser,
  getUserDailyStats,
};
