require("dotenv").config();
import config from "config";

import app from "./app";

const port = config.get<number>("port");
const server = app.listen(port, (): void =>
  console.log(`running on port ${port}`)
);

export default server;
