import { Request, Response } from "express";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { AppError, asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { validateIds } from "../../services/util/utilService";
import { addWeeks, endOfMonth, startOfMonth, subWeeks } from "date-fns";

const getAllDays = getAll(DailyDataModel);

const getCalenderData = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });
  const { month, year } = req.query;
  if (!month || !year) throw new Error("Please provide month and year");

  const startCurrentMonth = startOfMonth(new Date(Number(year), Number(month) - 1));
  const endCurrentMonth = endOfMonth(new Date(Number(year), Number(month) - 1));
  const startPrevWeek = subWeeks(startCurrentMonth, 1);
  const endNextWeek = addWeeks(endCurrentMonth, 1);

  const docs = await DailyDataModel.find({
    userId: loggedInUserId,
    date: {
      $gte: startPrevWeek,
      $lt: endNextWeek,
    },
  }).sort({ date: -1 });

  res.send({
    status: "success",
    requestedAt: new Date().toISOString(),
    results: docs.length,
    data: docs,
  });
});

const getDay = getOne(DailyDataModel);

const createDay = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });
  const { date } = req.body;
  if (!date) throw new AppError("Please provide date", 400);

  const doc = await DailyDataModel.create({
    ...req.body,
    date: new Date(date),
    userId: loggedInUserId,
  });

  res.status(201).send({
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

const updateDay = updateOne(DailyDataModel, [
  "intakes",
  "weight",
  "waist",
  "workouts",
  "isWeightWaistIgnored",
]);

const removeDay = deleteOne(DailyDataModel);

export { getAllDays, getCalenderData, getDay, getToday, createDay, updateDay, removeDay };
