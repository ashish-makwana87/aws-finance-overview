import { userRepository } from "../repositories/userRepository.js";
import { BadRequestError, ConflictError, UnauthenticatedError } from "../utils/httpErrors.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { signJWT } from "../utils/tokenUtils.js";

export const authService = {
  signup: async (email, password, role = "user") => {
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError("Email already exists");
    }

    const hashed = await hashPassword(password);

    const user = await userRepository.create({
      email,
      password: hashed,
      role,
      isActive: true,
      deactivatedAt: null,
      createdAt: new Date(),
    });

    return { message: "User registered", id: user.insertedId };
  },

  login: async (email, password) => {
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }
    
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new UnauthenticatedError("Invalid email");
    } 
    
    if (!user.isActive) {throw new UnauthenticatedError("Account is deactivated")}

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthenticatedError("Invalid password");
    }

    const token = signJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    return { message: "Signin success", token };
  },
};
