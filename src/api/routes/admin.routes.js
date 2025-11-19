import { adminStatsController } from "../../controllers/admin/adminStatsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";


export const adminRoutes = {
  "/admin/stats": {
    GET: [authMiddleware, allowRoles(["admin"]), adminStatsController],
  },
};
