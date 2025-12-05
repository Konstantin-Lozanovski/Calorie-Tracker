// backend/controllers/day.controller.js
import { pool } from "../src/db.js"

export const getDay = async (req, res) => {
    const { date } = req.params
    // TODO: Check if day exists. If no, create it + default meals. Return data.
    res.send(`Get Log for ${date}`)
}

export const getHistory = async (req, res) => {
    // TODO: Return list of past logs (date, total cals, weight)
    res.send("Get History")
}

export const updateWeight = async (req, res) => {
    const { date } = req.params
    // TODO: Update weight column in daily_logs
    res.send(`Update Weight for ${date}`)
}

export const addMealToDay = async (req, res) => {
    const { date } = req.params
    // TODO: Create a new Meal linked to this Date's log
    res.send(`Add Meal to ${date}`)
}