import { connectToDatabase } from "../libs/db.js";

export const userProfileRepository = {
  findByUserId: async (userId) => {
    const { db } = await connectToDatabase();
    return db.collection("profiles").findOne({ userId });
  },

  create: async (profileData) => {
    const { db } = await connectToDatabase();
    return db.collection("profiles").insertOne(profileData);
  },

  update: async (userId, updateData) => {
    const { db } = await connectToDatabase();
    return db
      .collection("profiles")
      .updateOne(
        { userId },
        { $set: { ...updateData, updatedAt: new Date() } },
        { upsert: true }
      );
  },

  delete: async (userId) => {
    const { db } = await connectToDatabase();
    return db.collection("profiles").deleteOne({ userId });
  },
  updateAvatarKey: async (userId, avatarKey) => {
    const { db } = await connectToDatabase();
    return db.collection("profiles").updateOne(
      { userId },
      {
        $set: {
          avatarKey,
          updatedAt: new Date(),
        },
      }
    );
  },
};
