import { connectToDatabase } from "../libs/db.js";


export const profileUpdateLogRepository = {
 create: async (log) => {
    const { db } = await connectToDatabase();
    await db.collection("profile_update_logs").insertOne(log);
  },
 findByUserId: async (userId) => {
    const { db } = await connectToDatabase();
    return db
      .collection("profile_update_logs")
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();
  },
}