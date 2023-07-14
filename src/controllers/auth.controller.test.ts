import { Request, NextFunction } from "express";
import { User } from "../entities/user.entity";
import {
  registerUserHandler,
  loginUserHandler,
  getProfileHanlder,
} from "./auth.controller";
import AppError, { APIStatus } from "../utils/appError";

const mockUser: any = {
  id: "4361d1f1-3085-4de5-ac93-7be2a9e7d9b9",
  email: "test@email.com",
  password: "password",
} as User;

const mockNext: NextFunction = jest.fn();
const mockResponse: any = {
  json: jest.fn().mockImplementation((value: any) => value),
  status: jest.fn().mockImplementation((statusCode) => {
    mockResponse.statusCode = statusCode;
    return mockResponse;
  }),
};

const mockRequest: Request = {} as Request;

jest.mock("../services/user.service", () => ({
  findUser: jest.fn().mockImplementation((query: any) => {
    return query.email === mockUser.email ? mockUser : null;
  }),
  createUser: jest.fn().mockImplementation((userData: any) => {
    return {
      ...mockUser,
      ...userData,
    };
  }),
  signTokens: jest.fn().mockImplementation(() => ({
    access_token: "accessToken",
  })),
}));

describe("AuthControler", () => {
  describe("registerUserHandler", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Create a new user successfully!", async () => {
      const userData = {
        email: "user@email.com",
        password: "password",
      };
      mockRequest.body = userData;

      await registerUserHandler(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: APIStatus.SUCCESS,
        access_token: "accessToken",
      });
    });

    test("Show throw error because of the duplicate email", async () => {
      const userData = {
        email: mockUser.email,
        password: "password",
      };
      mockRequest.body = userData;

      await registerUserHandler(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new AppError(400, "Email is already used"));
    });
  });

  describe("loginUserHandler", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Should login successfully!", async () => {
      const userData = {
        email: mockUser.email,
        password: mockUser.password,
      };
      mockRequest.body = userData;
      const spy = jest.spyOn(User, 'comparePasswords').mockResolvedValueOnce(true);

      await loginUserHandler(mockRequest, mockResponse, mockNext);

      expect(spy).toHaveBeenCalledWith(mockUser.password, mockUser.password)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: APIStatus.SUCCESS,
        access_token: "accessToken",
      });
    });

    test("Show throw error because user not found ", async () => {
      const userData = {
        email: 'user@gmail.com',
        password: "password",
      };
      mockRequest.body = userData;

      await loginUserHandler(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new AppError(404, "User not foud"));
    });

    test("Show throw error because of the wrong password", async () => {
      const userData = {
        email: mockUser.email,
        password: "wrong-password",
      };
      mockRequest.body = userData;
      const spy = jest.spyOn(User, 'comparePasswords').mockResolvedValueOnce(false);

      await loginUserHandler(mockRequest, mockResponse, mockNext);

      expect(spy).toHaveBeenCalledWith(userData.password, mockUser.password)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(mockNext).toHaveBeenCalledWith(new AppError(400, "Wrong password"));
    });
  });

  describe("getProfileHanlder", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Return a user profile successfully!", async () => {
      mockResponse.locals = {
        user: mockUser
      }
      await getProfileHanlder(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: APIStatus.SUCCESS,
        user: mockUser
      });
    });
  });
});
