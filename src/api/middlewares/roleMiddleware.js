import { error } from "../../utils/response.js";

export const allowRoles = (roles = []) => {
 
  return async (event) => {
    if (!event.user) {
      return error("Unauthorized", 401);
    }

    if (!roles.includes(event.user.role)) {
      return error("Forbidden: insufficient permissions", 403);
    }

    return null;
  };
};
