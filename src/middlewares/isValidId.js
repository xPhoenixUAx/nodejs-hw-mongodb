import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export function isValidId(req, res, next) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(createHttpError(400, "Invalid id"));
  }
  console.log({ id });
  next();
}
