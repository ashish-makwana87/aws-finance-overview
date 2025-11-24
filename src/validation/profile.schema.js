import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(30, { message: "First name must be less than 30 characters" })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(30, { message: "Last name must be less than 30 characters" })
    .optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone must be exactly 10 digits" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 9999999999, {
      message: "Phone must be a valid positive number",
    })
    .optional(),
  avatar: z.string().url().optional(),
  address: z
    .string()
    .max(100, { message: "Address must be less than 100 characters" })
    .optional(),
});
