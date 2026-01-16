import express from "express"
import {validate} from "../middleware/validation.js";
import {updateWeightSchema, dateSchema} from "../schemas/day.schema.js";
import {
  getDay,
  updateWeight,
} from "../controllers/day.controller.js"

const router = express.Router()

router.get("/:date", validate(dateSchema, "params"), getDay)
router.put("/:date/weight", validate(updateWeightSchema, "body"), validate(dateSchema, "params"), updateWeight)

export default router
