import { asyncErrorCatcher } from "../../services/error/errorService";
import { estimateFood } from "../../services/openAI/foodEstimateService";

export const estimateMeal = asyncErrorCatcher(async (req, res) => {
  const controller = new AbortController();
  const cancel = () => { if (!res.writableEnded) controller.abort(); };
  res.on("close", cancel);
  try {
    const result = await estimateFood(req.body?.description, controller.signal);
    if (!controller.signal.aborted) res.send({ status: "success", data: result });
  } finally { res.off("close", cancel); }
});
