import bcrypt from "bcrypt";
import { User } from "../db/models/user.js";
import createError from "http-errors";

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createError(409, "User already exists");
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createError(401, "Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createError(401, "Invalid credentials");
  }
}
