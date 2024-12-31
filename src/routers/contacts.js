import express from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  replaceContactController,
  patchContactController,
} from "../controllers/contacts.js";
import {
  createContactSchema,
  replaceContactSchema,
} from "../validation/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
const router = express.Router();
const jsonParser = express.json();

router.get("/", ctrlWrapper(getContactsController));
router.get("/:id", isValidId, ctrlWrapper(getContactByIdController));
router.post(
  "/",
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);
router.delete("/:id", isValidId, ctrlWrapper(deleteContactController));
router.put(
  "/:id",
  isValidId,
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(replaceContactController)
);
router.patch(
  "/:id",
  isValidId,
  jsonParser,
  validateBody(replaceContactSchema),
  ctrlWrapper(patchContactController)
);
export default router;
