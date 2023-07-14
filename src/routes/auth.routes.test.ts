import request from "supertest";

import app from "../app";
import { APIStatus } from "../utils/appError";
import { User } from "../entities/user.entity";

const mockUser: any = {
  id: "4361d1f1-3085-4de5-ac93-7be2a9e7d9b9",
  email: "test@email.com",
  password: "password",
} as User;

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
    return query.id === mockUser.id || query.email === mockUser.email
      ? mockUser
      : null;
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

describe("Test Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("/api/auth/login", () => {
    const LOGIN_URL = "/api/auth/login";

    afterEach(() => {
      jest.clearAllMocks();
    });
    
    const spy = jest
      .spyOn(User, "comparePasswords")
      .mockImplementation(async (password, hashPassword) =>
        Boolean(password === hashPassword)
      );

    test("Login Successfully", async () => {
      const userData = {
        email: mockUser.email,
        password: mockUser.password,
      };

      const res = await request(app).post(LOGIN_URL).send(userData);

      expect(spy).toHaveBeenCalledWith(mockUser.password, mockUser.password);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.SUCCESS);
      expect(res.body.access_token).toBe("accessToken");
    });

    test("Validation Error - User not found", async () => {
      const userData = {
        email: "user@email.com",
        password: mockUser.password,
      };
      const result = await request(app).post(LOGIN_URL).send(userData);

      expect(result.statusCode).toBe(404);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.message).toBe("User not foud");
    });

    test("Validation Error - Wrong password", async () => {
      const userData = {
        email: mockUser.email,
        password: "wrong_password",
      };
      const result = await request(app).post(LOGIN_URL).send(userData);

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.message).toBe("Wrong password");
    });

    test("Validation Error - Body required", async () => {
      const result = await request(app).post(LOGIN_URL).send({});

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.errors).toBeDefined();

      const messages = result.body.errors.map((error: any) => error.message);
      expect(messages).toEqual([
        "Email address is required",
        "Password is required",
      ]);
    });

    test("Validation Error - Email required", async () => {
      const result = await request(app).post(LOGIN_URL).send({
        password: mockUser.password,
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.errors).toBeDefined();

      const messages = result.body.errors.map((error: any) => error.message);
      expect(messages).toEqual(["Email address is required"]);
    });

    test("Validation Error - Password required", async () => {
      const result = await request(app).post(LOGIN_URL).send({
        email: mockUser.email
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.errors).toBeDefined();

      const messages = result.body.errors.map((error: any) => error.message);
      expect(messages).toEqual(["Password is required"]);
    });
  });

  describe("/api/auth/register", () => {
    const REGISTER_URL = "/api/auth/register";

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Register Successfully", async () => {
      const userData = {
        email: 'user@email.com',
        password: mockUser.password,
      };

      const res = await request(app).post(REGISTER_URL).send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.SUCCESS);
      expect(res.body.access_token).toBe("accessToken");
    });

    test("Failed to register - duplicate email", async () => {
      const userData = {
        email: mockUser.email,
        password: mockUser.password,
      };

      const res = await request(app).post(REGISTER_URL).send(userData);

      expect(res.status).toBe(400);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.FAILED);
      expect(res.body.message).toBe("Email is already used");
    });

    test("Validation Error - Body required", async () => {
      const result = await request(app).post(REGISTER_URL).send({});

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.errors).toBeDefined();

      const messages = result.body.errors.map((error: any) => error.message);
      expect(messages).toEqual([
        "Email address is required",
        "Password is required",
      ]);
    });

    test("Validation Error - Email required", async () => {
      const result = await request(app).post(REGISTER_URL).send({
        password: mockUser.password,
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.errors).toBeDefined();

      const messages = result.body.errors.map((error: any) => error.message);
      expect(messages).toEqual(["Email address is required"]);
    });

    test("Validation Error - Password required", async () => {
      const result = await request(app).post(REGISTER_URL).send({
        email: mockUser.email
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe(APIStatus.FAILED);
      expect(result.body.errors).toBeDefined();

      const messages = result.body.errors.map((error: any) => error.message);
      expect(messages).toEqual(["Password is required"]);
    });
  });

  describe("/api/auth/profile", () => {
    const GET_PROFILE_URL = "/api/auth/profile";

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Get profile Successfully", async () => {
      const res = await request(app).get(GET_PROFILE_URL).set({
        Authorization: 'Bearer VALID_TOKEN'
      })

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.SUCCESS);
      expect(res.body.user).toEqual(mockUser);
    });

    test("Failed to get profile - No accessToken", async () => {
      const res = await request(app).get(GET_PROFILE_URL)

      expect(res.status).toBe(401);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.FAILED);
      expect(res.body.message).toBe('You are not logged in');
    });

    test("Failed to get profile - Invalid token", async () => {
      const res = await request(app).get(GET_PROFILE_URL).set({
        Authorization: 'Bearer INVALID_TOKEN'
      })

      expect(res.status).toBe(401);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.FAILED);
      expect(res.body.message).toBe("Invalid token or user doesn't exist");
    });

    test("Failed to get profile - User not found", async () => {
      const res = await request(app).get(GET_PROFILE_URL).set({
        Authorization: 'Bearer NON_EXISTING_USER'
      })

      expect(res.status).toBe(404);
      expect(res.body).toBeDefined();
      expect(res.body.status).toBe(APIStatus.FAILED);
      expect(res.body.message).toBe("User not found");
    });
  });
});
