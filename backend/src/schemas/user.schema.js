import { z } from "zod";

export const updateGoalsSchema = z.object({
  body: z.object({
    calorieGoal: z
      .coerce
      .number()
      .min(1200, "Calorie goal must be at least 1200")
      .positive("Calorie goal must be positive"),
    proteinGoalPct: z.coerce.number().min(0).max(100),
    carbsGoalPct: z.coerce.number().min(0).max(100),
    fatGoalPct: z.coerce.number().min(0).max(100),
    weightGoal: z.coerce.number().positive("Weight goal must be positive"),
  }).refine(
    (data) => data.proteinGoalPct + data.carbsGoalPct + data.fatGoalPct === 100,
    {
      message: "Macronutrient percentages must add up to 100%",
      path: ["proteinGoalPct", "carbsGoalPct", "fatGoalPct"],
    }
  ),
});
