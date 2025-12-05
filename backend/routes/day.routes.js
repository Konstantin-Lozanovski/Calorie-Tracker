// backend/routes/day.routes.js
import express from "express"
import {
  getDay,
  getHistory,
  updateWeight,
  addMealToDay,
} from "../controllers/day.controller.js"

const router = express.Router()

// Specific order: 'history' must come BEFORE ':date' so it isn't treated as a date string
router.get("/history", getHistory)
router.get("/:date", getDay)
router.put("/:date/weight", updateWeight)
router.post("/:date/meals", addMealToDay)

export default router
