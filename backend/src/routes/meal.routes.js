import express from "express"
import { validate } from "../middleware/validation.js"
import { addEntrySchema, updateEntrySchema, entryIdSchema, mealIdSchema } from "../schemas/meal.schema.js"
import {
  addEntry,
  updateEntry,
  deleteEntry,
  getEntry,
  getMeal,
} from "../controllers/meal.controller.js"

const router = express.Router()


// Entry Routes
router.post("/:mealId/entries", validate(addEntrySchema), addEntry)
router.get("/:mealId", validate(mealIdSchema), getMeal)
router.put("/entries/:entryId", validate(updateEntrySchema), updateEntry)
router.get('/entries/:entryId', validate(entryIdSchema), getEntry)
router.delete("/entries/:entryId", validate(entryIdSchema), deleteEntry)

export default router