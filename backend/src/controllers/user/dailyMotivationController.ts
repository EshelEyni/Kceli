import { asyncErrorCatcher, AppError } from "../../services/error/errorService";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
import { getDailyMotivation } from "../../services/dailyMotivationService";

export const dailyMotivation = asyncErrorCatcher(async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (typeof req.body?.timeZone !== "string" || req.body.timeZone.length > 100)
    throw new AppError("Please provide a valid IANA time zone", 400);
  const data = await getDailyMotivation(getLoggedInUserIdFromReq(), req.body.timeZone);
  res.send({ status: "success", data });
});
