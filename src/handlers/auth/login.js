import { comparePassword } from "../../utils/passwordUtils.js";
import { success, error } from "../../utils/response.js";
import { signJWT, verifyJWT } from "../../utils/tokenUtils.js";
import { connectToDatabase } from "../../libs/db.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    if (!email || !password) {
      return error("Email and password are required", 400);
    }

    const { db } = await connectToDatabase();

    const user = await db.collection("users").findOne({ email });

    if (!user) return error("Invalid email", 401);

    const comparePass = await comparePassword(password, user.password);
    if (!comparePass) return error("Invalid password", 401);

    const token = signJWT({
      id: user._id?.toString() || user.id,
      email: user.email,
    });

    return success({ token });
  } catch (err) {
    console.error(err);
    return error("Login failed");
  }
};
