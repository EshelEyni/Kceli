import { Request, Response } from "express";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { validateIds } from "../../services/util/utilService";

const getAllDays = getAll(DailyDataModel);
const getDay = getOne(DailyDataModel);

const createDay = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const doc = await DailyDataModel.create({ ...req.body, userId: loggedInUserId });
  res.status(201).json({
    status: "success",
    data: doc,
  });
});

const getToday = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const doc = await DailyDataModel.findOne({ userId: loggedInUserId }).sort({ date: -1 }).limit(1);

  res.send({
    status: "success",
    data: doc,
  });
});

const updateDay = updateOne(DailyDataModel, ["intakes", "weight", "waist", "workouts"]);

const removeDay = deleteOne(DailyDataModel);

export { getAllDays, getDay, getToday, createDay, updateDay, removeDay };
