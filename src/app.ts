require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./utils/data-source";
import AppError from "./utils/appError";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import validateEnv from "./utils/validateEnv";

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: "10kb" }));

    // 2. Logger
    app.use(morgan(":method :url at :date[iso]"));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>("origin"),
        credentials: true,
      })
    );

    // ROUTES
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);

    // UNHANDLED ROUTE
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>("port");
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
