import {
  deleteProfileController,
  getProfileController,
  updateProfileController,
} from "../../controllers/user/userProfileController.js";
import { profileSchema } from "../../validation/profile.schema.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";

export const userRoutes = {
  "/user/profile": {
    GET: [authMiddleware, getProfileController],
    PUT: [authMiddleware, validate(profileSchema), updateProfileController],
    DELETE: [authMiddleware, deleteProfileController],
  },
};
