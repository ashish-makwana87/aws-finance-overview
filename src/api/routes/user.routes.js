import {
  deleteProfileController,
  getProfileController,
  updateProfileController,
} from "../../controllers/user/userProfileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const userRoutes = {
  "/user/profile": {
    GET: [authMiddleware, getProfileController],
    PUT: [authMiddleware, updateProfileController],
    DELETE: [authMiddleware, deleteProfileController],
  },
};
