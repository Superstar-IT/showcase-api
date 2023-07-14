import { Request, NextFunction } from "express";

import { User } from "../entities/user.entity";
import { authenticateToken } from "./authenticateToken";
import AppError from "../utils/appError";

const mockUser: any = {
  id: "4361d1f1-3085-4de5-ac93-7be2a9e7d9b9",
  email: "test@email.com",
  password: "password",
} as User;

const mockRequest: Request = {} as Request;
const mockResponse: any = {
  json: jest.fn().mockImplementation((value: any) => value),
  status: jest.fn().mockImplementation((statusCode) => {
    mockResponse.statusCode = statusCode;
    return mockResponse;
  }),
};
const mockNext: NextFunction = jest.fn();

jest.mock("../utils/jwt", () => {
  return {
    verifyJwt: jest.fn().mockImplementation((token: string) =>
      token === "VALID_TOKEN"
        ? { id: mockUser.id }
        : token === "NON_EXISTING_USER"
        ? {
            id: "95669fc9-59ea-4c15-aa39-f802c66d76f2",
          }
        : null
    ),
  };
});

jest.mock("../services/user.service", () => ({
  findUser: jest.fn().mockImplementation((query: any) => {
    return query.id === mockUser.id ? mockUser : null;
  }),
}));

describe("Middleware - authenticateToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Authorized API call", async () => {
    mockRequest.headers = {
      authorization: "Bearer VALID_TOKEN",
    };

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test("Failed to authenticate because user not found", async () => {
    mockRequest.headers = {
      authorization: "Bearer NON_EXISTING_USER",
    };

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError(404, `User not found`));
  });

  test("Failed to authenticate because of invalid token", async () => {
    mockRequest.headers = {
      authorization: "Bearer INVALID_TOKEN",
    };

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      new AppError(401, `Invalid token or user doesn't exist`)
    );
  });

  test("Failed to authenticate because no token", async () => {
    mockRequest.headers = {};

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError(401, `You are not logged in`));
  });
});
