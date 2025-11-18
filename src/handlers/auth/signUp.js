import { connectToDatabase } from "../../libs/db.js";
import { hashPassword } from "../../utils/passwordUtils.js";
import { success, error } from "../../utils/response.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    if (!email || !password) {
      return error("Email and password are required", 400);
    }

    const { db } = await connectToDatabase();

    const existing = await db.collection("users").findOne({ email });

    if (existing) return error("Email already exists", 409);

    const hashed = await hashPassword(password);

    const user = await db.collection("users").insertOne({
      email,
      password: hashed,
      createdAt: new Date(),
    });

    return success({ message: "User registered", id: user.insertedId });
  } catch (err) {
    console.error(err);
    return error("Signup failed");
  }
};
