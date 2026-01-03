import { connectToDatabase } from "../libs/db.js";

export const userRepository = {
  findByEmail: async (email) => {
    const { db } = await connectToDatabase();
    return db.collection("users").findOne({ email });
  },

  create: async (userData) => {
    const { db } = await connectToDatabase();
    return db.collection("users").insertOne(userData);
  },

  deactivateById: async (userId) => {
  const { db } = await connectToDatabase();
  return db.collection("users").updateOne(
    { userId },
    {
      $set: {
        isActive: false,
        deactivatedAt: new Date(),
      },
    }
  );
},
};
