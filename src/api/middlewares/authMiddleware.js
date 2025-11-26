import { verifyJWT } from "../../utils/tokenUtils.js";
import { error } from "../../utils/response.js";
import { UnauthenticatedError } from "../../utils/httpErrors.js";

export const authMiddleware = async (event) => {
  
    const authHeader = event.headers?.authorization || event.headers?.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError("Unauthorized")
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);
    
    if(!decoded) {
      throw new UnauthenticatedError("Invalid or expired token")
    }

    //attaching user data to event
    event.user = decoded;

    return null;
};
