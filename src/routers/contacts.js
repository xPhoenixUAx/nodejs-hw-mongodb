import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  replaceContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
const router = express.Router();
const jsonParser = express.json();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:id", ctrlWrapper(getContactByIdController));
router.post("/", jsonParser, ctrlWrapper(createContactController));
router.delete("/:id", ctrlWrapper(deleteContactController));
router.put("/:id", jsonParser, ctrlWrapper(replaceContactController));
export default router;
