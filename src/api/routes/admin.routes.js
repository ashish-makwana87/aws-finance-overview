import { adminStatsController } from "../../controllers/admin/adminStatsController.js";
import { adminUpdateProfileController } from "../../controllers/admin/adminUpdateProfileController.js";
import { adminOnlyMiddleware } from "../middlewares/adminOnlyMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

export const adminRoutes = {
  "/admin/stats": {
    GET: [authMiddleware, allowRoles(["admin"]), adminStatsController],
  },
  "/admin/profile/{userId}": {
    PUT: [authMiddleware, adminOnlyMiddleware, adminUpdateProfileController],
  },
};


