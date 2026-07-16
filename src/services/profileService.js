import { userProfileRepository } from "../repositories/userProfileRepository.js";
import { userProfileModel } from "../models/userProfileModel.js";
import { deleteAvatarObjects } from "../utils/s3Utils.js";
import { activityLogger } from "../utils/activityLogger.js";
import { publishImageProcessingJob } from "../utils/sqsUtils.js";
import { profileCacheRepository } from "../repositories/profileCacheRepository.js";

export const profileService = {
  getProfile: async (userId) => {

    // Checking cache 
    let profile = await profileCacheRepository.get(userId);

    if (profile) {
    console.log("Profile Cache HIT");

    if (profile.avatarKey) {
      profile.avatarUrl = `${process.env.CLOUDFRONT_URL}/avatars/optimized/${profile.avatarKey}.webp`;
    } else {
      profile.avatarUrl = null;
    }

    return profile;
    }
    
    console.log(profile);
    console.log("Profile Cache MISS");

    // Fetch from MongoDB 
    profile = await userProfileRepository.findByUserId(userId);

    if (!profile) {
      profile = userProfileModel.defaultProfile(userId);
      await userProfileRepository.create(profile);
    }

    // Store in cache 
    await profileCacheRepository.put(profile);

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

    // Invalidate cache 
    await profileCacheRepository.delete(userId);

    await activityLogger.logProfileUpdate({ userId, updatedFields });

    return { message: "Profile updated" };
  },

  deleteProfile: async (userId) => {
    await userProfileRepository.delete(userId);

    // Remove cache 
    await profileCacheRepository.delete(userId);

    return { message: "Profile deleted" };
  },

  updateAvatarKey: async (userId, avatarKey) => {
    if (!userId || !avatarKey) return;

    await userProfileRepository.updateAvatarKey(userId, avatarKey);

    // Remove cache 
    await profileCacheRepository.delete(userId);
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

  uploadComplete: async (userId, key) => {
    await publishImageProcessingJob({
      bucket: process.env.AVATAR_BUCKET,
      key,
      userId,
    });
  },
};
