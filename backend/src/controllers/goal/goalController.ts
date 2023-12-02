import { Request, Response } from "express";
import GoalModel from "../../models/goal/goalModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { validateIds } from "../../services/util/utilService";

const getGoals = getAll(GoalModel);
const getGoalById = getOne(GoalModel);
const getUserGoal = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const doc = await GoalModel.findOne({
    userId: loggedInUserId,
    type: "user",
    isCompleted: false,
  }).sort({ date: -1 });

  res.status(200).send({
    status: "success",
    data: doc,
  });
});
const createGoal = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const doc = await GoalModel.create({
    ...req.body,
    userId: loggedInUserId,
  });

  res.status(201).send({
    status: "success",
    data: doc,
  });
});
const updateGoal = updateOne(GoalModel, ["type", "description", "isCompleted"]);
const deleteGoal = deleteOne(GoalModel);

export { getGoals, getGoalById, getUserGoal, createGoal, updateGoal, deleteGoal };
