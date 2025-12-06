// backend/routes/day.routes.js
import express from "express"
import {
  getDay,
  updateWeight,
} from "../controllers/day.controller.js"

const router = express.Router()

// Specific order: 'history' must come BEFORE ':date' so it isn't treated as a date string
router.get("/:date", getDay)
router.put("/:date/weight", updateWeight)

export default router
