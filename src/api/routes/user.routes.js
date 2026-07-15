import { getAvatarUploadURLController } from "../../controllers/user/avatarUploadController.js";
import { deactivateAccountController } from "../../controllers/user/deactivateAccountController.js";
import { uploadCompleteController } from "../../controllers/user/uploadCompleteController.js";
import {
  deleteProfileController,
  getProfileController,
  updateProfileController,
} from "../../controllers/user/userProfileController.js";
import { profileSchema } from "../../validation/profile.schema.js";
import { uploadCompleteSchema } from "../../validation/uploadComplete.schema.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";

export const userRoutes = {
  "/user/profile": {
    GET: [authMiddleware, getProfileController],
    PUT: [authMiddleware, validate(profileSchema), updateProfileController],
    DELETE: [authMiddleware, deleteProfileController],
  },
  "/user/avatar/upload-url": {
    POST: [authMiddleware, getAvatarUploadURLController],
  },
  "/user/avatar/upload-complete": {POST: [authMiddleware, validate(uploadCompleteSchema), uploadCompleteController]},
  "/user/deactivate": {
  POST: [authMiddleware, deactivateAccountController],
}
};
