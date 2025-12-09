import { pool } from "../src/db.js"
import {BadRequestError} from "../errors/index.js";

export const getDay = async (req, res) => {
    const { date } = req.params
    const userId = req.user.id

    if(!userId) throw new BadRequestError("User not found")

    // 1. Check if log exists, if not create it
    let logResult = await pool.query(
        "SELECT id, user_id, date::text, weight FROM daily_logs WHERE user_id = $1 AND date = $2",
        [userId, date]
    )


    if (logResult.rows.length === 0) {
        // Create Log
        const newLog = await pool.query(
            "INSERT INTO daily_logs (user_id, date) VALUES ($1, $2) RETURNING id, user_id, date::text, weight",
            [userId, date]
        )
        logResult = newLog

        // Create Default Meals
        const logId = newLog.rows[0].id
        const defaultMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
        for(let i = 0; i < defaultMeals.length; i++){
            const mealName = defaultMeals[i]
            const mealOrder = i + 1

            await pool.query(
                "INSERT INTO meals(daily_log_id, meal, meal_order) VALUES ($1, $2, $3)",
                [logId, mealName, mealOrder]
            )
        }



    }

    const dailyLog = logResult.rows[0]

    // 2. Fetch Meals and Entries for this log
    // We join meals, meal_entries, and foods to get the full tree
    const mealsResult = await pool.query(
        `SELECT 
            m.id as meal_id, 
            m.meal as meal_name,
            me.id as entry_id,
            me.quantity,
            f.id as food_id,
            f.name as food_name,
            f.calories,
            f.protein,
            f.carbs,
            f.fat,
            f.serving_unit
         FROM meals m
         LEFT JOIN meal_entries me ON m.id = me.meal_id
         LEFT JOIN foods f ON me.food_id = f.id
         WHERE m.daily_log_id = $1
         ORDER BY m.id, me.id`,
        [dailyLog.id]
    )

    // 3. Structure the data
    const mealsMap = new Map()

    mealsResult.rows.forEach(row => {
        if (!mealsMap.has(row.meal_id)) {
            mealsMap.set(row.meal_id, {
                id: row.meal_id,
                name: row.meal_name,
                entries: []
            })
        }
        
        if (row.entry_id) {
            mealsMap.get(row.meal_id).entries.push({
                id: row.entry_id,
                quantity: row.quantity,
                food: {
                    id: row.food_id,
                    name: row.food_name,
                    calories: Number(row.calories),
                    protein: Number(row.protein),
                    carbs: Number(row.carbs),
                    fat: Number(row.fat),
                    unit: row.serving_unit
                }
            })
        }
    })

    const responseData = {
        ...dailyLog,
        meals: Array.from(mealsMap.values())
    }

    res.status(200).json(responseData)
}

export const updateWeight = async (req, res) => {
    const { date } = req.params
    const { weight } = req.body
    const userId = req.user.id

    if (!userId) throw new BadRequestError("User not found");
    if (weight === undefined) throw new BadRequestError("Weight not provided");
    if (typeof weight !== "number" || isNaN(weight)) throw new BadRequestError("Weight must be a number");
    if (weight <= 0) throw new BadRequestError("Weight must be positive");

    const result = await pool.query(
        `UPDATE daily_logs
        SET weight = $1
        WHERE user_id = $2 AND date = $3
        RETURNING id, user_id, date::text, weight`,
        [weight, userId, date]
    )

    if (!result.rows.length) {
        return res.status(404).json({ msg: "No log found for this date" });
    }

    res.status(200).json({ msg: "Weight updated", log: result.rows[0] })
}

