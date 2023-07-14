export default {
  NODE_ENV: "test",
  port: "PORT",
  postgresConfig: {
    host: "POSTGRES_HOST",
    port: "POSTGRES_PORT",
    username: "POSTGRES_USER",
    password: "POSTGRES_PASSWORD",
    database: "POSTGRES_DB",
  },

  accessTokenPrivateKey: "JWT_ACCESS_TOKEN_PRIVATE_KEY",
  accessTokenPublicKey: "JWT_ACCESS_TOKEN_PUBLIC_KEY",
  origin: "http://localhost:3000",
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
};
