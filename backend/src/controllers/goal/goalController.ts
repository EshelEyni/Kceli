import { Request, Response } from "express";
import GoalModel from "../../models/goal/goalModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { validateIds } from "../../services/util/utilService";

const getGoals = getAll(GoalModel);
const getGoalById = getOne(GoalModel);
const createGoal = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const doc = await GoalModel.create({
    ...req.body,
    userId: loggedInUserId,
    date: new Date(),
  });

  res.status(201).send({
    status: "success",
    data: doc,
  });
});
const updateGoal = updateOne(GoalModel, ["type", "description", "isCompleted"]);
const deleteGoal = deleteOne(GoalModel);

export { getGoals, getGoalById, createGoal, updateGoal, deleteGoal };
