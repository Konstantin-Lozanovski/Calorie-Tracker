import { z } from "zod";

export const addEntrySchema = z.object({
  params: z.object({
    mealId: z.coerce.number().positive("Meal ID must be positive"),
  }),
  body: z.object({
    foodId: z.coerce.number()
      .positive("Food ID must be positive")
      .refine(val => val !== undefined, { message: "Food ID is required" }),
    quantity: z.coerce.number()
      .positive("Quantity must be greater than 0"),
  }),
});

export const updateEntrySchema = z.object({
  params: z.object({
    entryId: z.coerce.number().positive("Entry ID must be positive"),
  }),
  body: z.object({
    quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
  }),
});

export const entryIdSchema = z.object({
  params: z.object({
    entryId: z.coerce.number().positive("Entry ID must be positive"),
  }),
});

export const mealIdSchema = z.object({
  params: z.object({
    mealId: z.coerce.number().positive("Meal ID must be positive"),
  }),
})





