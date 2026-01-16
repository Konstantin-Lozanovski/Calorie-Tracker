import { z } from "zod";

// Body schema
export const updateWeightSchema = z.object({
  weight: z.number({ required_error: "Weight is required" }).positive("Weight must be positive"),
});

export const dateSchema = z.object({
  date: z
    .string({ required_error: "Date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === val;
      },
      { message: "Invalid calendar date" }
    )
});

