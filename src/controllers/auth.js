import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from "../services/auth.js";

export async function registerController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);

  res
    .status(201)
    .send({ status: 201, message: "User registered", data: registeredUser });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  const session = await loginUser(email, password);

  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: "User logged in",
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId === "string") {
    await logoutUser(sessionId);
  }
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");
  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: "Session refreshed",
    data: {
      accessToken: session.accessToken,
    },
  });
}
