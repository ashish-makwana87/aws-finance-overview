import { profileUpdateLogRepository } from "../repositories/profileUpdateLogRepository.js";


export const activityLogger = {
 logProfileUpdate: async ({ userId, updatedFields }) => {
  const logEntry = {
    event: "PROFILE_UPDATED",
    userId,
    updatedFields,
    timestamp: new Date(),
  };

  // CloudWatch log
  console.log(JSON.stringify(logEntry));

  // DB collection
  await profileUpdateLogRepository.create(logEntry);
},

logAvatarUploadInitiated: async ({ userId, avatarKey }) => {
    const logEntry = {
      event: "AVATAR_UPLOAD_INITIATED",
      userId,
      avatarKey,
      timestamp: new Date(),
    };

    console.log(JSON.stringify(logEntry));
    await profileUpdateLogRepository.create(logEntry);
  },

  logAvatarDeleted: async ({ userId, oldAvatarKey }) => {
    const logEntry = {
      event: "PREV_AVATAR_DELETED",
      userId,
      oldAvatarKey,
      timestamp: new Date(),
    };

    console.log(JSON.stringify(logEntry));
    await profileUpdateLogRepository.create(logEntry);
  },
}