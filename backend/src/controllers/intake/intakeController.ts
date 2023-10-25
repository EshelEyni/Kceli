import { Request, Response } from "express";
import { FavoriteIntakeModel } from "../../models/intake/intakeModel";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { asyncErrorCatcher } from "../../services/error/errorService";
import { validateIds } from "../../services/util/utilService";
import { deleteOne, updateOne } from "../../services/factory/factoryService";

const getUserFavoriteIntakes = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const docs = await FavoriteIntakeModel.find({ userId: loggedInUserId });

  res.send({
    status: "success",
    requestedAt: new Date().toISOString(),
    results: docs.length,
    data: docs,
  });
});

const createFavoriteIntake = asyncErrorCatcher(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserIdFromReq();
  validateIds({ id: loggedInUserId, entityName: "loggedInUser" });

  const doc = await FavoriteIntakeModel.create({
    ...req.body,
    userId: loggedInUserId,
  });

  res.status(201).send({
    status: "success",
    data: doc,
  });
});

const updateFavoriteIntake = updateOne(FavoriteIntakeModel, ["items", "isRecorded", "recordedAt"]);

const removeFavoriteIntake = deleteOne(FavoriteIntakeModel);

export { getUserFavoriteIntakes, createFavoriteIntake, updateFavoriteIntake, removeFavoriteIntake };
