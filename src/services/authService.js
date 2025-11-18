import { userRepository } from "../repositories/userRepository.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { signJWT } from "../utils/tokenUtils.js";

export const authService = {
  signup: async (email, password) => {
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashed = await hashPassword(password);

    const user = await userRepository.create({
      email,
      password: hashed,
      createdAt: new Date(),
    });

    return { message: "User registered", id: user.insertedId };
  },

  login: async (email, password) => {
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email");
      error.statusCode = 401;
      throw error;
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = signJWT({ id: user._id.toString(), email: user.email });

    return { token };
  },
};
