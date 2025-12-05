// backend/routes/meal.routes.js
import express from "express"
import {
    deleteMeal,
    getEntries,
    addEntry,
    updateEntry,
    deleteEntry,
} from "../controllers/meal.controller.js"

const router = express.Router()

// Meal Routes
router.delete("/:mealId", deleteMeal)

// Entry Routes
router.get("/:mealId/entries", getEntries)
router.post("/:mealId/entries", addEntry)
router.put("/entries/:entryId", updateEntry)
router.delete("/entries/:entryId", deleteEntry)

export default router