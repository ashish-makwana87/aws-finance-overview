import { authService } from "../../services/authService.js";
import { error, success } from "../../utils/response.js";

export const loginController = async (event) => {
  try {
    const body = event.validatedBody;

    const result = await authService.login(body.email, body.password);
    return success(result);
  } catch (err) {
    console.error(err);
    return error(err.message || "Login failed", err.statusCode || 500);
  }
};
