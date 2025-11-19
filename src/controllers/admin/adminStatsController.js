import { success } from "../../utils/response.js";

export const adminStatsController = async (event) => {
  return success({ message: "Admin stats", admin: event.user });
};


