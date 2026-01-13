import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/utils/httpErrors.js", () => ({
  BadRequestError: class BadRequestError extends Error {},
}));

const { validate } = await import("../../src/api/middlewares/validate.js");
const { BadRequestError } = await import("../../src/utils/httpErrors.js");

const { signupSchema, loginSchema } = await import(
  "../../src/validation/auth.schema.js"
);

const { profileSchema } = await import(
  "../../src/validation/profile.schema.js"
);

describe("validate middleware", () => {
  // creating Lambda-like event
  const createEvent = (body) => ({
    body: JSON.stringify(body),
  });

  // ===========================
  //  Signup validation
  // ===========================

  describe("signup validation", () => {
    it("passes and sets validatedBody for valid signup payload", async () => {
      const event = createEvent({
        email: "test@example.com",
        password: "StrongPass123",
      });

      const middleware = validate(signupSchema);

      const result = await middleware(event);

      expect(result).toBeNull();
      expect(event.validatedBody).toEqual({
        email: "test@example.com",
        password: "StrongPass123",
      });
    });

    it("throws BadRequestError for invalid signup payload", async () => {
      const event = createEvent({
        email: "invalid-email",
        password: "",
      });

      const middleware = validate(signupSchema);

      await expect(middleware(event)).rejects.toBeInstanceOf(BadRequestError);
    });
  });

  // ===========================
  //   Login validation
  // ===========================

  describe("login validation", () => {
    it("passes and sets validatedBody for valid login payload", async () => {
      const event = createEvent({
        email: "test@example.com",
        password: "password123",
      });

      const middleware = validate(loginSchema);

      await middleware(event);

      expect(event.validatedBody).toEqual({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("throws BadRequestError when required fields are missing", async () => {
      const event = createEvent({
        email: "test@example.com",
      });

      const middleware = validate(loginSchema);

      await expect(middleware(event)).rejects.toBeInstanceOf(BadRequestError);
    });
  });

  // ===========================
  //   Profile validation
  // ===========================

  describe("profile validation", () => {
    it("passes for valid profile update payload", async () => {
      const event = createEvent({
        firstName: "Ashish",
        lastName: "Makwana",
        phone: "1234567890",
        address: "India",
      });

      const middleware = validate(profileSchema);

      await middleware(event);

      expect(event.validatedBody.firstName).toBe("Ashish");
      expect(event.validatedBody.phone).toBe(1234567890);
    });

    it("throws BadRequestError for invalid profile payload", async () => {
      const event = createEvent({
        phone: 12345, // invalid type
      });

      const middleware = validate(profileSchema);

      await expect(middleware(event)).rejects.toBeInstanceOf(BadRequestError);
    });
  });
});
