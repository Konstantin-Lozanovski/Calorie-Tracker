// backend/controllers/meal.controller.js
import { pool } from "../src/db.js"

// --- Meal Logic ---
export const deleteMeal = async (req, res) => {
  const { mealId } = req.params
  res.send(`Delete Meal ${mealId}`)
}

// --- Entry Logic ---
export const getEntries = async (req, res) => {
  const { mealId } = req.params
  res.send(`Get Entries for Meal ${mealId}`)
}

export const addEntry = async (req, res) => {
  const { mealId } = req.params
  // TODO: Add food_id and quantity to meal_entries
  res.send(`Add Entry to Meal ${mealId}`)
}

export const updateEntry = async (req, res) => {
  const { entryId } = req.params
  res.send(`Update Entry ${entryId}`)
}

export const deleteEntry = async (req, res) => {
  const { entryId } = req.params
  res.send(`Delete Entry ${entryId}`)
}