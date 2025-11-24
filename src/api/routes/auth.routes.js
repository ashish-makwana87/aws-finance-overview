import { signupController } from "../../controllers/auth/signupController.js";
import { loginController } from "../../controllers/auth/loginController.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, signupSchema } from "../../validation/auth.schema.js";


export const authRoutes = {
 "/auth/signup": {POST: [validate(signupSchema), signupController]},
 "/auth/login": {POST: [validate(loginSchema), loginController]}
}

