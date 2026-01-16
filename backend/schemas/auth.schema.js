import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  email: z.string().email("Please provide a valid email").trim().transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email").trim().transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})
