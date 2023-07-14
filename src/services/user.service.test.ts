import { User as UserModel } from "../entities/user.entity";
import { createUser, findUser, signTokens } from "./user.service";

const mockUser: any = {
  id: "4361d1f1-3085-4de5-ac93-7be2a9e7d9b9",
  email: "test@email.com",
  password: "password",
} as UserModel;

jest.mock("../utils/data-source", () => {
  return {
    AppDataSource: {
      getRepository: jest.fn().mockImplementation(() => {
        return {
          create: jest.fn().mockImplementation((user:any) => {
            const newUser = new UserModel();
            newUser.id = mockUser.id;
            newUser.email = user.email;
            newUser.password = user.password;
            return newUser;
          }),
          save: jest.fn().mockImplementation((user: UserModel) => user),
          findOneBy: jest.fn().mockImplementation((query: any) => {
            if (query.id === mockUser.id || query.email === mockUser.email)
              return mockUser;
            return null;
          }),
        };
      }),
    },
  };
});
jest.mock("../utils/jwt", () => {
  return {
    signJwt: jest.fn().mockImplementation(() => 'accessToken')
  }
})

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findUser", () => {
    test("Returning null because user not found by id", async () => {
      const receivedUser = await findUser({ id : 'id'});
      expect(receivedUser).toBeNull();
    });

    test("Returning null because user not found by email", async () => {
      const receivedUser = await findUser({ email : 'email'});
      expect(receivedUser).toBeNull();
    });


    test("Returning a user by id", async () => {
      const receivedUser = await findUser({ id: mockUser.id });
      expect(receivedUser).toEqual(mockUser);
    });

    test("Returning a user by email", async () => {
      const receivedUser = await findUser({ email: mockUser.email });
      expect(receivedUser).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    test("Create a new user successfully!", async () => {
      const receivedUser = await createUser(mockUser);
      expect(receivedUser).toEqual(mockUser);
    });
  });

  describe('signTokens', () => {
    test("Returning access_token", async () => {
      const { access_token } = await signTokens(mockUser);
      expect(access_token).toEqual('accessToken');
    });
  });

});
