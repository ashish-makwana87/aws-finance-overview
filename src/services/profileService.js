import { userProfileRepository } from "../repositories/userProfileRepository.js";
import { userProfileModel } from "../models/userProfileModel.js";
import { deleteAvatarObjects } from "../utils/s3Utils.js";
import { activityLogger } from "../utils/activityLogger.js";

export const profileService = {
  getProfile: async (userId) => {
    let profile = await userProfileRepository.findByUserId(userId);

    if (!profile) {
      profile = userProfileModel.defaultProfile(userId);
      await userProfileRepository.create(profile);
    }

    if (profile.avatarKey) {
      profile.avatarUrl = `${process.env.CLOUDFRONT_URL}/avatars/optimized/${profile.avatarKey}.webp`;
    } else {
      profile.avatarUrl = null;
    }
    
    return profile;
  },

  updateProfile: async (userId, data) => {
    const updatedFields = Object.keys(data);

    await userProfileRepository.update(userId, data);
    await activityLogger.logProfileUpdate({ userId, updatedFields });

    return { message: "Profile updated" };
  },

  deleteProfile: async (userId) => {
    await userProfileRepository.delete(userId);
    return { message: "Profile deleted" };
  },

  updateAvatarKey: async (userId, avatarKey) => {
    if (!userId || !avatarKey) return;

    await userProfileRepository.updateAvatarKey(userId, avatarKey);
  },

  cleanupOldAvatar: async (userId) => {
    if (!userId) return;

    const profile = await userProfileRepository.findByUserId(userId);
    if (!profile || !profile.avatarKey) return;

    await deleteAvatarObjects(profile.avatarKey);

    await activityLogger.logAvatarDeleted({
      userId,
      oldAvatarKey: profile.avatarKey,
    });
  },
};
