import request from "supertest";
import axios from "axios";

import app from "../app";
import { APIStatus } from "../utils/appError";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Test User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("/api/users/random", () => {
    const GET_RANDOM_USER_URL = "/api/users/random";
    const expectedUser = { id: 1, name: "John" };

    test("Should return a random user successfully!", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          results: [expectedUser],
        },
        status: 200,
        statusText: "Ok",
        headers: {},
        config: {},
      });
      const res = await request(app).get(GET_RANDOM_USER_URL);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://randomuser.me/api/"
      );

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.SUCCESS);
      expect(res.body.user).toEqual(expectedUser);
    });

    test("Should throw error!", async () => {
      mockedAxios.get.mockRejectedValueOnce({
        data: {},
        status: 500,
        statusText: "Internal server error",
        headers: {},
        config: {},
      });
      const res = await request(app).get(GET_RANDOM_USER_URL);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://randomuser.me/api/"
      );

      expect(res.status).toBe(500);
    });
  });
});
