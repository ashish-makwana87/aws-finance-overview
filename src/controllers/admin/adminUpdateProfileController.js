import { profileService } from "../../services/profileService.js";
import { success } from "../../utils/response.js";

export const adminUpdateProfileController = async (event) => {
  try {
    const targetUserId = event.pathParameters.userId;
    const body = JSON.parse(event.body);

    const result = await profileService.updateProfile(targetUserId, body);

    return success(result);
  } catch (error) {
    return error(error.message, 500);
  }
};
