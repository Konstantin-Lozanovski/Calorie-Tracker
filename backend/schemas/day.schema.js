import { z } from "zod";

export const getDaySchema = z.object({
  params: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  }),
});

export const updateWeightSchema = z.object({
  params: getDaySchema.shape.params,
  body: z.object({
    weight: z.coerce.number({ required_error: "Weight is required" }).positive(),
  }),
});


