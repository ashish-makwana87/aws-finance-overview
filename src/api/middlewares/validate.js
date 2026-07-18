import { BadRequestError } from "../../utils/httpErrors.js";

export const validate = (schema) => {
  
  return async (event) => {
    const body = JSON.parse(event.body);
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const messages = result.error.issues.map((item) => item.message);
      
      throw new BadRequestError(messages.join(", "));
    }

    event.validatedBody = result.data;

    return null;
  };
};
