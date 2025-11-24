import { userProfileRepository } from "../repositories/userProfileRepository.js";
import { userProfileModel } from "../models/userProfileModel.js";

export const profileService = {
  getProfile: async (userId) => {
    let profile = await userProfileRepository.findByUserId(userId);

    if (!profile) {
      profile = userProfileModel.defaultProfile(userId);
      await userProfileRepository.create(profile);
    }

    return profile;
  },

  updateProfile: async (userId, data) => {
    await userProfileRepository.update(userId, data);
    return { message: "Profile updated" };
  },

  deleteProfile: async (userId) => {
    await userProfileRepository.delete(userId);
    return { message: "Profile deleted" };
  },
};
