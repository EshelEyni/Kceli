import { Request, Response } from "express";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { AppError, asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { getIsraeliDate, validateIds } from "../../services/util/utilService";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";

const getAllDays = getAll(DailyDataModel);

const getCalenderData = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });
  const { month, year } = req.query;
  if (!month || !year) throw new Error("Please provide month and year");

  const startCurrentMonth = startOfMonth(new Date(Number(year), Number(month) - 1));
  const endCurrentMonth = endOfMonth(new Date(Number(year), Number(month) - 1));
  const startPrevMonth = startOfMonth(subMonths(startCurrentMonth, 1));
  const endNextMonth = endOfMonth(addMonths(endCurrentMonth, 1));

  const docs = await DailyDataModel.find({
    userId: loggedInUserId,
    date: {
      $gte: startPrevMonth,
      $lt: endNextMonth,
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
  if (!doc) {
    const date = getIsraeliDate();
    const doc = await DailyDataModel.create({
      date,
      userId: loggedInUserId,
    });

    res.status(201).send({
      status: "success",
      data: doc,
    });
  } else {
    res.send({
      status: "success",
      data: doc,
    });
  }
});

const updateDay = updateOne(DailyDataModel, [
  "intakes",
  "weight",
  "waist",
  "workouts",
  "isWeightWaistIgnored",
  "hungerEvents",
]);

const removeDay = deleteOne(DailyDataModel);

export { getAllDays, getCalenderData, getDay, getToday, createDay, updateDay, removeDay };
