import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { APIStatus } from "../utils/appError";

export const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: APIStatus.FAILED,
          errors: error.errors,
        });
      }
      next(error);
    }
  };
