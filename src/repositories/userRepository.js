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
};
