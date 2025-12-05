// backend/controllers/user.controller.js
import { pool } from "../src/db.js"

export const getMe = async (req, res) => {
  // TODO: Get user details from DB based on req.user.id
    res.send("Get User Details")
}

export const updateGoals = async (req, res) => {
  // TODO: Update calorie, protein_pct, carbs_pct, fat_pct
    res.send("Update User Goals")
}