import { jest } from "@jest/globals";
import { connectToDatabase, closeDatabase } from "../../src/libs/db.js";

jest.resetModules();

jest.unstable_mockModule("../../src/utils/tokenUtils.js", () => ({
  signJWT: jest.fn(() => "mock-jwt-token"),
  verifyJWT: () => ({
    id: "test-user-123",
    role: "user",
    email: "test@example.com",
    isActive: true,
  }),
}));

const { handler } = await import("../../src/api/handler.js");

let db;

beforeAll(async () => {
  ({ db } = await connectToDatabase());
});

beforeEach(async () => {
  const collections = await db.collections();
  for (const col of collections) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await closeDatabase();
});

const buildEvent = ({ method, path, body, auth = true }) => ({
  requestContext: {
    http: {
      method,
      path,
    },
  },
  headers: auth ? { Authorization: "Bearer test-token" } : {},
  body: JSON.stringify(body ?? {}),
});

describe("Profile API integration tests", () => {
  it("GET /user/profile returns default profile when none exists", async () => {
    const event = buildEvent({
      method: "GET",
      path: "/user/profile",
    });

    const response = await handler(event);
    console.log("STATUS:", response.statusCode);
    console.log("BODY:", response.body);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.userId).toBe("test-user-123");
  });

  it("PUT /user/profile updates profile data", async () => {
    const event = buildEvent({
      method: "PUT",
      path: "/user/profile",
      body: {
        firstName: "Ashish",
        phone: "1234567890",
      },
    });

    const response = await handler(event);
    console.log("STATUS:", response.statusCode);
    console.log("BODY:", response.body);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.message).toBe("Profile updated");

    const profileInDb = await db
      .collection("profiles")
      .findOne({ userId: "test-user-123" });

    console.log(profileInDb);
    expect(profileInDb).not.toBeNull();
    expect(profileInDb.firstName).toBe("Ashish");
  });

  it("DELETE /user/profile removes profile", async () => {
    // creating profile
    await db.collection("profiles").insertOne({
      userId: "test-user-123",
      firstName: "Ashish",
    });

    const event = buildEvent({
      method: "DELETE",
      path: "/user/profile",
    });

    const response = await handler(event);
    console.log("STATUS:", response.statusCode);
    console.log("BODY:", response.body);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.message).toBe("Profile deleted");

    const profile = await db
      .collection("profiles")
      .findOne({ userId: "test-user-123" });
    console.log(profile);
    expect(profile).toBeNull();
  });
});
