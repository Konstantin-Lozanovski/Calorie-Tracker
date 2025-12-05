import express from "express"
import { searchFoods, createFood } from "../controllers/food.controller.js"

const router = express.Router()

router.get("/", searchFoods)
router.post("/", createFood)

export default router
