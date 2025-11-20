import { error } from "../../utils/response.js";

export const validate = (schema) => {

  return async (event) => {

    try {
      const body = JSON.parse(event.body);
      const result = schema.safeParse(body);

      if (!result.success) {
        const messages = result.error.errors.map((item) => item.message);
        return error(messages.join(", "), 400);
      }

      event.validatedBody = result.data;
      
      return null;
    } catch (err) {
      return error("Invalid JSON body", 400);
    }
  };
};