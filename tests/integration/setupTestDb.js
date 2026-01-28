import "dotenv/config";
import { MongoClient } from "mongodb";

let client;
let db;

export const connectTestDb = async () => {
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  db = client.db(process.env.TEST_DB_NAME);
  return db;
};

export const clearTestDb = async () => {
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};

export const closeTestDb = async () => {
  await client.close();
};
