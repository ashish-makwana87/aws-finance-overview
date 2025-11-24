import { success, error } from "../../utils/response.js";
import { profileService } from "../../services/profileService.js";

export const getProfileController = async (event) => {
  try {
    const userId = event.user.id;
    const profile = await profileService.getProfile(userId);
    return success(profile);
  } catch (err) {
    return error(err.message, 500);
  }
};

export const updateProfileController = async (event) => {
  try {
    const userId = event.user.id;
    const body = event.validatedBody;

    const result = await profileService.updateProfile(userId, body);
    return success(result);
  } catch (err) {
    return error(err.message, 500);
  }
};

export const deleteProfileController = async (event) => {
  try {
    const userId = event.user.id;

    const result = await profileService.deleteProfile(userId);
    return success(result);
  } catch (err) {
    return error(err.message, 500);
  }
};
