import path from "node:path";
import express from "express";
// import pino from "pino-http";
import cors from "cors";
import { getEnVar } from "./utils/getEnVar.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import router from "./routers/index.js";
import cookieParser from "cookie-parser";

const PORT = Number(getEnVar("PORT", "3000"));
export const setupServer = () => {
  const app = express();
  app.use("/avatars", express.static(path.resolve("src/public/avatars")));
  // app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  // app.use(
  //   pino({
  //     transport: {
  //       target: "pino-pretty",
  //     },
  //   })
  // );
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Time ${new Date().toLocaleString()}`);
  });
};
