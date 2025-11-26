import {
  ForbiddenError,
  UnauthenticatedError,
} from "../../utils/httpErrors.js";

export const allowRoles = (roles = []) => {
  return async (event) => {
    if (!event.user) {
      throw new UnauthenticatedError("Unauthorized");
    }

    if (!roles.includes(event.user.role)) {
      throw new ForbiddenError("Forbidden: insufficient permissions");
    }

    return null;
  };
};
