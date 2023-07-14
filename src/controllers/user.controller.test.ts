import axios from "axios";
import { Request, NextFunction } from "express";

import { getRandomUserHandler } from "./user.controller";
import { APIStatus } from "../utils/appError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserController", () => {
  describe("getRandomUserHandler", () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
  
    const expectedUser = { id: 1, name: "John" };
    const mockRequest: Request = {} as Request;
    const mockResponse: any = {
      json: jest.fn().mockReturnValue({
        status: APIStatus.SUCCESS,
        user: expectedUser,
      }),
      status: jest.fn().mockImplementation(() => {
        mockResponse.statusCode = 200;
        return mockResponse;
      }),
    };
    const mockNext: NextFunction = jest.fn();
  
    test("Returning a random user successfully!", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          results: [expectedUser],
        },
        status: 200,
        statusText: "Ok",
        headers: {},
        config: {},
      });
  
      await getRandomUserHandler(mockRequest, mockResponse, mockNext);
      expect(mockedAxios.get).toHaveBeenCalledWith("https://randomuser.me/api/");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: APIStatus.SUCCESS,
        user: expectedUser
      });
    });
  
    test("Failed to get a random user!", async () => {
      const mockedError = {
        status: 500,
        statusText: "Internal server error",
        headers: {},
        config: {},
      };
      mockedAxios.get.mockRejectedValueOnce(mockedError);
      await getRandomUserHandler(mockRequest, mockResponse, mockNext);
      expect(mockedAxios.get).toHaveBeenCalledWith("https://randomuser.me/api/");
      expect(mockResponse.status).toHaveBeenCalledTimes(0);
      expect(mockResponse.json).toHaveBeenCalledTimes(0);
      expect(mockNext).toHaveBeenCalledWith(mockedError);
    });
  });
})

