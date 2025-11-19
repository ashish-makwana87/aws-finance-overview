import { verifyJWT } from "../../utils/tokenUtils.js";
import { error } from "../../utils/response.js";

export const authMiddleware = async (event) => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    //attaching user data to event
    event.user = decoded;

    return null;  
  } catch (err) {
    return error("Invalid or expired token", 401);
  }
};
