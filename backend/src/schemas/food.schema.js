import { z } from "zod";

export const searchFoodSchema = z.object({
  query: z.object({
    search: z
      .string({ required_error: "Search term is required" })
      .trim()
      .min(1, "Search term cannot be empty")
      .max(100, "Search term is too long"),
  })
});

export const createFoodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" })
      .min(1, "Name cannot be empty")
      .transform((val) => val.trim()),

    brand: z.string()
      .optional()
      .transform((val) => val?.trim() || null),

    serving_unit: z.string({ required_error: "Serving unit is required" })
      .min(1, "Serving unit cannot be empty")
      .transform((val) => val.trim()),

    calories: z.coerce.number({ required_error: "Calories are required" }),
    protein: z.coerce.number({ required_error: "Protein is required" }),
    carbs: z.coerce.number({ required_error: "Carbs are required" }),
    fat: z.coerce.number({ required_error: "Fat are required" }),
  }),
});

export const getFoodSchema = z.object({
  params: z.object({
    foodId: z.coerce.number({ required_error: "Food ID is required" }).positive("Food ID must be positive"),
  }),
});
