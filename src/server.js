import express from "express";
import pino from "pino-http";
import cors from "cors";
import * as contactServices from "./services/contacts.js";
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

  app.get("/contacts", async (req, res) => {
    const data = await contactServices.getGontacts();

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data,
    });
  });
  app.get("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    const data = await contactServices.getContactByID(id);
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "Contact not found",
      });
    }
    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data,
    });
  });

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
