import { userService } from "../../services/userService.js";
import { success } from "../../utils/response.js";

export const deactivateAccountController = async (event) => {
  const userId = event.user.id;

  const result = await userService.deactivateAccount(userId);
  return success(result);
};
