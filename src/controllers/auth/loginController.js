import { authService } from "../../services/authService.js";
import { success } from "../../utils/response.js";

export const loginController = async (event) => {
  const body = event.validatedBody;

  const result = await authService.login(body.email, body.password);
  return success(result);
};
