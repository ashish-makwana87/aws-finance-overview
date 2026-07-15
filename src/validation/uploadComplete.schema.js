import { z } from "zod";


export const uploadCompleteSchema = z.object({
  key: z.string().min(1),
});