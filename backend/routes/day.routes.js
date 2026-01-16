import express from "express"
import {validate} from "../middleware/validation.js";
import {getDaySchema, updateWeightSchema} from "../schemas/day.schema.js";
import {
  getDay,
  updateWeight,
} from "../controllers/day.controller.js"

const router = express.Router()

router.get("/:date", validate(getDaySchema), getDay)
router.put("/:date/weight", validate(updateWeightSchema), updateWeight)

export default router
