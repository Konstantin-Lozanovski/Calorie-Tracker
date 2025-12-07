import { pool } from "../src/db.js"
import {BadRequestError} from "../errors/index.js";

export const addEntry = async (req, res) => {
    const { mealId } = req.params
    const { foodId, quantity } = req.body

    if (!foodId || quantity === undefined || quantity <= 0) {
        throw new BadRequestError("Please provide a valid foodId and a quantity greater than 0");
    }

    const mealResult = await pool.query(
        `SELECT * FROM meals WHERE id = $1`,
        [mealId]
    )
    if (!mealResult.rows.length) {
        throw new BadRequestError("Meal not found");
    }

    const foodResult = await pool.query(
        `SELECT * FROM foods WHERE id = $1`,
        [foodId]
    )
    if (!foodResult.rows.length) {
        throw new BadRequestError("Food not found");
    }

    const entryResult = await pool.query(
        `
        INSERT INTO meal_entries(meal_id, food_id, quantity) 
        VALUES ($1, $2, $3) 
        RETURNING id, meal_id, food_id, quantity
        `,
        [mealId, foodId, quantity]
    )
    const entry = entryResult.rows[0]

    res.status(201).json(entry)

}

export const updateEntry = async (req, res) => {
    const { entryId } = req.params
    if (quantity === undefined || quantity < 0) throw new BadRequestError("Provide a valid quantity");
    res.send(`Update Entry ${entryId}`)
}

export const deleteEntry = async (req, res) => {
    const { entryId } = req.params
    if (quantity === undefined || quantity < 0) throw new BadRequestError("Provide a valid quantity");
    res.send(`Delete Entry ${entryId}`)
}