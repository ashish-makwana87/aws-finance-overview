import { activityLogger } from "../utils/activityLogger.js";
import { generateUploadURL } from "../utils/s3Utils.js";
import { profileService } from "./profileService.js";

export const fileService = {
  createAvatarUpload: async (userId, fileType) => {
    await profileService.cleanupOldAvatar(userId);

    const avatarKey = `${userId}-${Date.now()}`;
    const s3Key = `avatars/original/${avatarKey}`;

    const uploadURL = await generateUploadURL({
      key: s3Key,
      contentType: fileType,
    });
   
   await activityLogger.logAvatarUploadInitiated({userId, avatarKey})

    return { uploadURL, avatarKey };
  },
};
