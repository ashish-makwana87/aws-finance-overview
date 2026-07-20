import jwt from "jsonwebtoken";
import { getSecrets } from "../config/secrets.js";

export const signJWT = (payload) => {
  const { jwtSecret } = getSecrets();

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXP ?? "15m",
  });

  return token;
};

export const verifyJWT = (token) => {
  const { jwtSecret } = getSecrets();

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const verifiedToken = jwt.verify(token, jwtSecret);

  return verifiedToken;
};
