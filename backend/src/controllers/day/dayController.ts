import { Request, Response } from "express";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { asyncErrorCatcher } from "../../services/error/errorService";
import { deleteOne, getAll, getOne, updateOne } from "../../services/factory/factoryService";
import { validateIds } from "../../services/util/utilService";

const getAllDays = getAll(DailyDataModel);
const getDay = getOne(DailyDataModel);

const getToday = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const currDate = new Date();

  const doc = await DailyDataModel.findOne({
    userId: loggedInUserId,
    date: {
      $gte: currDate.setHours(0, 0, 0, 0),
      $lt: currDate.setHours(23, 59, 59, 999),
    },
  });

  if (!doc) {
    const newDoc = await DailyDataModel.create({ userId: loggedInUserId });
    res.status(201).send({
      status: "success",
      data: newDoc,
    });
  } else {
    res.send({
      status: "success",
      data: doc,
    });
  }
});

const updateDay = updateOne(DailyDataModel, ["intakes"]);

const removeDay = deleteOne(DailyDataModel);

export { getAllDays, getDay, getToday, updateDay, removeDay };
