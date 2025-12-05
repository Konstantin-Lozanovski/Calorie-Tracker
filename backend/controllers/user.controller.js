import { pool } from "../src/db.js"
import {BadRequestError, NotFoundError} from "../errors/index.js";

export const getMe = async (req, res) => {
    const result = await pool.query(
        "SELECT id, username, calorie_goal, protein_goal_pct, carbs_goal_pct, fat_goal_pct FROM users WHERE id = $1",
        [req.user.id]
    )

    if(result.rows.length === 0) {
        throw new NotFoundError("User not found")
    }

    res.status(200).json(result.rows[0])
}

export const updateGoals = async (req, res) => {
    const {calorieGoal, proteinGoalPct, carbsGoalPct, fatGoalPct} = req.body

    if(!calorieGoal || !proteinGoalPct || !carbsGoalPct || !fatGoalPct) {
        throw new BadRequestError("Please provide calories, protein, carbs and fat")
    }

    const totalPct = Number(proteinGoalPct) + Number(carbsGoalPct) + Number(fatGoalPct)
    if(totalPct !== 100) {
        throw new BadRequestError("Macronutrient percentages must add up to 100%")
    }

    const result = await pool.query(
        `UPDATE users
        SET calorie_goal = $1, protein_goal_pct = $2, carbs_goal_pct = $3, fat_goal_pct = $4
        WHERE id = $5
        RETURNING id, username, calorie_goal, protein_goal_pct, carbs_goal_pct, fat_goal_pct
        `,
        [calorieGoal,proteinGoalPct,carbsGoalPct,fatGoalPct,req.user.id]
    )

    if(result.rows.length === 0) {
        throw new NotFoundError("User not found")
    }

    res.status(200).json(result.rows[0])


}