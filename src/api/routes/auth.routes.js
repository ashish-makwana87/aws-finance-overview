import { signupController } from "../../controllers/auth/signupController.js";
import { loginController } from "../../controllers/auth/loginController.js";


export const authRoutes = {
 "/auth/signup": {POST: signupController},
 "/auth/login": {POST: loginController}
}

