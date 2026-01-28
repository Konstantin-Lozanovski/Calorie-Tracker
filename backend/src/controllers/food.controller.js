import { pool } from "../db.js"
import {BadRequestError, NotFoundError} from "../errors/index.js";

export const searchFoods = async (req, res) => {
    const { search } = req.query

    const result = await pool.query(
      `SELECT *
      FROM foods
      WHERE LOWER(name) LIKE $1
      OR LOWER(COALESCE(brand, '')) LIKE $1
      LIMIT 20`,
      [`${search.toLowerCase()}%`]
    )

    res.status(200).json(result.rows)
}

export const createFood = async (req, res) => {
    let {name, brand,calories,protein,carbs,fat,serving_unit} = req.body;

    const result = await pool.query(
        `INSERT INTO foods (name, brand, calories, protein, carbs, fat, serving_unit)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [name,brand,calories,protein,carbs,fat,serving_unit]
    )

    res.status(201).json(result.rows[0])

}

export const getFood = async (req, res) => {
  const {foodId} = req.params

  const result = await pool.query(
    `SELECT * FROM foods WHERE id = $1`,
    [foodId]
  )

  if(result.rowCount === 0) throw new NotFoundError("Food not found")

  res.status(200).json(result.rows[0])
}