import express from "express"
import { validate } from "../middleware/validation.js"
import { searchFoodSchema, createFoodSchema, getFoodSchema } from "../schemas/food.schema.js";
import { searchFoods, createFood, getFood } from "../controllers/food.controller.js"

const router = express.Router()

router.get("/", validate(searchFoodSchema), searchFoods)
router.post("/", validate(createFoodSchema), createFood)
router.get("/:foodId", validate(getFoodSchema), getFood)

export default router
