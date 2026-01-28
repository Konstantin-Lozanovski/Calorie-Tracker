import { pool } from "../db.js"
import {BadRequestError, NotFoundError} from "../errors/index.js";

export const getMe = async (req, res) => {
    const result = await pool.query(
        `SELECT id, username, calorie_goal, protein_goal_pct, carbs_goal_pct, fat_goal_pct, weight_goal
        FROM users WHERE id = $1`,
        [req.user.id]
    )

    if(result.rows.length === 0) {
        throw new NotFoundError("User not found")
    }

    res.status(200).json(result.rows[0])
}

export const updateGoals = async (req, res) => {
    const {calorieGoal, proteinGoalPct, carbsGoalPct, fatGoalPct, weightGoal} = req.body

    const result = await pool.query(
        `UPDATE users
        SET calorie_goal = $1, protein_goal_pct = $2, carbs_goal_pct = $3, fat_goal_pct = $4, weight_goal = $5
        WHERE id = $6
        RETURNING id, username, calorie_goal, protein_goal_pct, carbs_goal_pct, fat_goal_pct, weight_goal
        `,
        [calorieGoal,proteinGoalPct,carbsGoalPct,fatGoalPct,weightGoal,req.user.id]
    )

    if(result.rows.length === 0) {
        throw new NotFoundError("User not found")
    }

    res.status(200).json(result.rows[0])
}