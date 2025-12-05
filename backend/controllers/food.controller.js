// backend/controllers/food.controller.js
import { pool } from "../src/db.js"

export const searchFoods = async (req, res) => {
  const { search } = req.query
  // TODO: SELECT * FROM foods WHERE name ILIKE ...
  const result = await pool.query("SELECT * FROM foods WHERE name ILIKE $1", [`%${search}%`])
  res.json(result.rows)
}

export const createFood = async (req, res) => {
  // TODO: Insert new food into foods table
  res.send("Create new Food")
}