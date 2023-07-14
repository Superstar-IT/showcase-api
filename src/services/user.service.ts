import config from "config";
import { FindOptionsWhere } from "typeorm";

import { User } from "../entities/user.entity";
import { AppDataSource } from "../utils/data-source";
import { signJwt } from "../utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export type AccessTokenResponse = {
  access_token: string 
}

export const createUser = async (input: Partial<User>): Promise<User> => {
  return await userRepository.save(userRepository.create(input));
};

export const findUser = async (
  query: FindOptionsWhere<User>
): Promise<User | null> => {
  return await userRepository.findOneBy(query);
};

export const signTokens = async (user: User): Promise<AccessTokenResponse> => {
  const access_token = signJwt({ id: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  return { access_token };
};
