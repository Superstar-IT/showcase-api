require("dotenv").config();
import express, { Application, Request, Response, NextFunction } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./utils/data-source";
import AppError from "./utils/appError";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import validateEnv from "./utils/validateEnv";

validateEnv();
AppDataSource.initialize().catch((error) => console.log(error));

const app: Application = express();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(morgan(":method :url at :date[iso]"));
app.use(
  cors({
    origin: config.get<string>("origin"),
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  error.status = error.status || "error";
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

export default app;
