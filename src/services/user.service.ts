import config from "config";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../utils/data-source";
import { signJwt } from "../utils/jwt";
import { FindOptionsWhere } from "typeorm";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
  return await userRepository.save(userRepository.create(input));
};

export const findUser = async (
  query: FindOptionsWhere<User>
): Promise<User | null> => {
  return await userRepository.findOneBy(query);
};
export const signTokens = async (user: User) => {
  const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  return { access_token };
};
