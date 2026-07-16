import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const dynamoDb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PROFILE_CACHE_TABLE;

const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

export const profileCacheRepository = {
  async get(userId) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
      },
    });

    const { Item } = await dynamoDb.send(command);

    return Item ?? null;
  },

  async put(profile) {
    const ttl = Math.floor(Date.now() / 1000) + CACHE_TTL_SECONDS;

    const { _id, createdAt, updatedAt, ...cacheProfile } = profile;

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...cacheProfile,
        ttl,
      },
    });

    await dynamoDb.send(command);
  },

  async delete(userId) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        userId,
      },
    });

    await dynamoDb.send(command);
  },
};
