import { generateUploadURL } from "../utils/s3Utils.js";

export const fileService = {
  createAvatarUpload: async (userId, fileType) => {
    const key = `avatars/${userId}-${Date.now()}`;

    const uploadURL = await generateUploadURL({
      key,
      contentType: fileType,
    });

    const publicURL = `https://${process.env.AVATAR_BUCKET}.s3.amazonaws.com/${key}`;

    return { uploadURL, publicURL };
  },
};
