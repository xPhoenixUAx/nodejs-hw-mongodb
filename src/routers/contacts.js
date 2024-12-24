import express from "express";
import {
  getContactsController,
  getContactByIdController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
const router = express.Router();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:id", ctrlWrapper(getContactByIdController));

export default router;
