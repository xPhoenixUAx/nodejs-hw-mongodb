import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getEnVar } from "./utils/getEnVar.js";

const PORT = Number(getEnVar("PORT", "3000"));
export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use((req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Time ${new Date().toLocaleString()}`);
  });
};
