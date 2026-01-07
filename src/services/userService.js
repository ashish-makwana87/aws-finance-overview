import { userRepository } from "../repositories/userRepository.js";

export const userService = {
  deactivateAccount: async (userId) => {
    await userRepository.deactivateById(userId);

    return { message: "Account deactivated successfully" };
  },
};
