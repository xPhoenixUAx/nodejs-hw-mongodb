import bcrypt from "bcrypt";
import { User } from "../db/models/User.js";
import createError from "http-errors";
import { Session } from "../db/models/session.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";
import hadlebars from "handlebars";
import * as fs from "node:fs";
import path from "node:path";

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve("src/templates/reset-password.hbs"),
  { encoding: "utf-8" }
);

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

export async function requestResetPassword(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createError(404, "User not found");
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const html = hadlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendMail({
    from: "pavloff12@gmail.com",
    to: user.email,
    subject: "Password reset",
    html: html({ resetToken }),
  });

  console.log(`http://localhost:3000/password-reset?token=${resetToken}`);
}
export async function resetPassword(newPassword, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });
    if (user === null) {
      throw createError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw createError(401, "Invalid token");
    }
    throw error;
  }
}
