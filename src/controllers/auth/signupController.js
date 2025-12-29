import { authService } from "../../services/authService.js";
import { success } from "../../utils/response.js";

export const signupController = async (event) => {
    const body = event.validatedBody;
    const result = await authService.signup(body.email, body.password);

    return success(result);
};
