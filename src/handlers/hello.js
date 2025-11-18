import { connectToDatabase } from "../libs/db.js";
import { success, error } from "../utils/response.js";

export const handler = async () => {

  try {
    const { db } = await connectToDatabase();

    const result = await db.collection("test").insertOne({
      message: "Lambda function plus MongoDB integration",
      createdAt: new Date()
    });

    return success({
      status: "ok",
      insertedId: result.insertedId,
    });

  } catch (err) {
    console.error("Lambda Error:", err);
    return error("Database operation failed", 500);
  }
};
