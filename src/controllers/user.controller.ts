import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { APIStatus } from "../utils/appError";

export const getRandomUserHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { results } = await axios
      .get("https://randomuser.me/api/")
      .then((response) => response.data);

    res.status(200).json({
      status: APIStatus.SUCCESS,
      user: results[0],
    });
  } catch (err: any) {
    next(err);
  }
};
