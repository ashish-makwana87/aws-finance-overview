import { BadRequestError } from "../../utils/httpErrors.js";
import { errorHandler } from "../utils/response.js";

export const validate = (schema) => {
  return async (event) => {
    const body = JSON.parse(event.body);
    const result = schema.safeParse(body);

    console.log(result);
    if (!result.success) {
      const messages = result.error.issues.map((item) => item.message);
      console.log(messages);
      throw new BadRequestError(messages.join(", "));
    }

    event.validatedBody = result.data;

    return null;
  };
};
