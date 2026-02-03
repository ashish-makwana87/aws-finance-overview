import jwt from "jsonwebtoken";

export const signJWT = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP ?? "1d",
  });

  return token;
};

export const verifyJWT = (token) => {
  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

  return verifiedToken;
};
