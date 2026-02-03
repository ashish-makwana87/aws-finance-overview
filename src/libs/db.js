import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  const dbName =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DB_NAME
      : process.env.DB_NAME;

  if (!dbName) {
    throw new Error("Database name is not defined");
  }

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
