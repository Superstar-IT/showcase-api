import { NextFunction, Request, Response } from "express";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import { createUser, findUser, signTokens } from "../services/user.service";
import AppError, { APIStatus } from "../utils/appError";
import { User } from "../entities/user.entity";

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const duplicatedUser = await findUser({ email: email.toLowerCase() });

    if (duplicatedUser) {
      throw new AppError(400, "Email is already used");
    }

    const newUser = await createUser({
      email: email.toLowerCase(),
      password,
    });
    const { access_token } = await signTokens(newUser);

    res.status(201).json({
      status: APIStatus.SUCCESS,
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email: email.toLowerCase() });

    if (!user) {
      return next(new AppError(404, "User not foud"));
    }

    if (!(await User.comparePasswords(password, user.password))) {
      return next(new AppError(400, "Wrong password"));
    }

    const { access_token } = await signTokens(user);

    res.status(200).json({
      status: APIStatus.SUCCESS,
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getProfileHanlder = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    try {
      const user = res.locals.user;

      res.status(200).json({
        status: APIStatus.SUCCESS,
        user,
      });
    } catch (err: any) {
      next(err);
    }
  } catch (err: any) {
    next(err);
  }
};
