import { NextFunction, Request, Response } from "express";
require("dotenv").config();
import express from "express";
import helmet from "helmet";
import compression from "compression";
import ExpressMongoSanitize from "express-mongo-sanitize";
import requestSanitizer from "../../middlewares/HTMLSanitizer/HTMLSanitizerMiddleware";
import hpp from "hpp";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { requestLogger } from "../../middlewares/logger/loggerMiddleware";
import { AppError, errorHandler } from "../../services/error/errorService";
import setupAsyncLocalStorage from "../../middlewares/setupALS/setupALSMiddleware";
import userRouter from "../../routers/user/userRouter";
import dayRouter from "../../routers/day/dayRouter";
import authRouter from "../../routers/auth/authRouter";
import calorieRouter from "../../routers/calorie/calorieRouter";
import workoutRouter from "../../routers/workout/workoutRouter";
import { requestLimiter } from "../../services/rateLimiterService";

const isProdEnv = process.env.NODE_ENV === "production";

const app = express();
app.use(compression());

app.use(helmet());
app.use(cookieParser());
app.use(
  express.json({
    limit: "15kb",
  })
);

app.use(requestLimiter);
app.use(ExpressMongoSanitize());
app.use(requestSanitizer);
app.use(
  hpp({
    whitelist: ["date"], // add whitelisted query params here
  })
);

// cors
if (isProdEnv) {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://127.0.0.1:5173",
      "http://localhost:5173",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.all("*", setupAsyncLocalStorage);

if (!isProdEnv)
  app.use((req: Request, res: Response, next: NextFunction) => {
    requestLogger(req, res, next);
  });

app.use("/api/user", userRouter);
app.use("/api/day", dayRouter);
app.use("/api/auth", authRouter);
app.use("/api/calorie", calorieRouter);
app.use("/api/workout", workoutRouter);

app.get("/**", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
