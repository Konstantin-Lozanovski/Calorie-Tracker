import express from "express"
import { searchFoods, createFood, getFood } from "../controllers/food.controller.js"

const router = express.Router()

router.get("/", searchFoods)
router.post("/", createFood)
router.get("/:foodId", getFood)

export default router
