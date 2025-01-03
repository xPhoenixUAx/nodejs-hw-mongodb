import bcrypt from "bcrypt";
import { User } from "../db/models/User.js";
import createError from "http-errors";
import { Session } from "../db/models/session.js";
import crypto from "node:crypto";

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

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw createError(401, "Invalid session");
  }

  if (session.refreshToken !== refreshToken) {
    throw createError(401, "Invalid session");
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createError(401, "Session expired");
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
