import { Request, Response } from "express";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { AppError, asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { validateIds } from "../../services/util/utilService";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";

import { ensureToday } from "../../services/dayRolloverService";

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

const getToday = asyncErrorCatcher(async (req: Request, res: Response) => {
  const userId = getLoggedInUserIdFromReq();
  validateIds({ id: userId, entityName: "loggedInUser" });
  const timeZone = req.query.timeZone ?? req.body?.timeZone ?? "Asia/Jerusalem";
  if (typeof timeZone !== "string")
    throw new AppError("Please provide a valid IANA time zone", 400);
  const { doc, created } = await ensureToday(userId!, timeZone);
  res.status(created ? 201 : 200).send({ status: "success", data: doc });
});

// Compatibility for older clients: starting a day can only get/create today.
const createDay = getToday;

const updateDay = updateOne(DailyDataModel, [
  "intakes",
  "weight",
  "waist",
  "workouts",
  "isWeightWaistIgnored",
]);

const removeDay = deleteOne(DailyDataModel);

export { getAllDays, getCalenderData, getDay, getToday, createDay, updateDay, removeDay };
