import { Request, Response } from "express";
import { WorkoutModel } from "../../models/workout/workoutModel";
import { deleteOne, getOne, updateOne } from "../../services/factory/factoryService";
import { asyncErrorCatcher } from "../../services/error/errorService";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { validateIds } from "../../services/util/utilService";

const getAllWorkouts = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const docs = await WorkoutModel.find({ userId: loggedInUserId });

  res.send({
    status: "success",
    requestedAt: new Date().toISOString(),
    results: docs.length,
    data: docs,
  });
});

const getWorkout = getOne(WorkoutModel);

const createWorkout = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const workout = req.body;

  const doc = await WorkoutModel.create({
    ...workout,
    userId: loggedInUserId,
  });

  res.status(201).send({
    status: "success",
    data: doc,
  });
});

const updateWorkout = updateOne(WorkoutModel, ["description", "type", "split", "items"]);
const deleteWorkout = deleteOne(WorkoutModel);

export { getAllWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout };
