import { asyncErrorCatcher } from "../../services/error/errorService";
import { analyzeFoodPhoto } from "../../services/openAI/foodScanService";

export const scanFood = asyncErrorCatcher(async (req, res) => {
  const controller = new AbortController();
  const cancel = () => { if (!res.writableEnded) controller.abort(); };
  res.on("close", cancel);
  try {
    const result = await analyzeFoodPhoto(req.body?.image, req.body?.context ?? "", controller.signal);
    if (!controller.signal.aborted) res.send({ status: "success", data: result });
  } finally {
    if (req.body) delete req.body.image;
    res.off("close", cancel);
  }
});
