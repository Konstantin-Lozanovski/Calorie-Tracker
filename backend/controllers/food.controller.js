import { pool } from "../src/db.js"
import {BadRequestError, NotFoundError} from "../errors/index.js";

export const searchFoods = async (req, res) => {
    const { search } = req.query

    if(!search || search.trim().length === 0) throw new BadRequestError("Please provide a search term")

    const result = await pool.query(
        `SELECT * FROM foods 
         WHERE name ILIKE $1
         OR COALESCE(brand, '') ILIKE $1
         LIMIT 20`,
        [`%${search}%`]
    )

    res.status(200).json(result.rows)
}

export const createFood = async (req, res) => {
    let {name, brand,calories,protein,carbs,fat,serving_unit} = req.body;

    name = name?.trim();
    brand = brand?.trim() || null;
    serving_unit = serving_unit?.trim();

    if (!name || !serving_unit || calories == null || protein == null || carbs == null || fat == null) {
        throw new BadRequestError("Please provide all required fields");
    }

    if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
        throw new BadRequestError("Calories, protein, carbs, and fat must be numbers");
    }

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

  if(!foodId) throw new BadRequestError("Please provide a food id")

  const result = await pool.query(
    `SELECT * FROM foods WHERE id = $1`,
    [foodId]
  )

  if(result.rowCount === 0) throw new NotFoundError("Food not found")

  res.status(200).json(result.rows[0])
}