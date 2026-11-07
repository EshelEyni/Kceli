import { asyncErrorCatcher } from "../../services/error/errorService";
import { estimateFoodWithHistory } from "../../services/intake/foodEstimateHistoryService";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";

export const estimateMeal = asyncErrorCatcher(async (req, res) => {
  const controller = new AbortController();
  const cancel = () => { if (!res.writableEnded) controller.abort(); };
  res.on("close", cancel);
  try {
    const result = await estimateFoodWithHistory(req.body?.description, getLoggedInUserIdFromReq(), controller.signal);
    if (!controller.signal.aborted) res.send({ status: "success", data: result });
  } finally { res.off("close", cancel); }
});
