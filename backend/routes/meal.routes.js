import express from "express"
import {
  addEntry,
  updateEntry,
  deleteEntry,
  getEntry,
} from "../controllers/meal.controller.js"

const router = express.Router()


// Entry Routes
router.post("/:mealId/entries", addEntry)
router.put("/entries/:entryId", updateEntry)
router.get('/entries/:entryId', getEntry)
router.delete("/entries/:entryId", deleteEntry)

export default router