import {pool} from "../src/db.js"
import {BadRequestError, NotFoundError} from "../errors/index.js";

export const addEntry = async (req, res) => {
  const {mealId} = req.params
  const {foodId, quantity} = req.body

  if (!foodId || quantity === undefined || quantity <= 0) {
    throw new BadRequestError("Please provide a valid foodId and a quantity greater than 0");
  }

  const mealResult = await pool.query(
    `SELECT *
     FROM meals
     WHERE id = $1`,
    [mealId]
  )
  if (!mealResult.rows.length) {
    throw new BadRequestError("Meal not found");
  }

  const foodResult = await pool.query(
    `SELECT *
     FROM foods
     WHERE id = $1`,
    [foodId]
  )
  if (!foodResult.rows.length) {
    throw new BadRequestError("Food not found");
  }

  const entryResult = await pool.query(
    `INSERT INTO meal_entries(meal_id, food_id, quantity)
     VALUES ($1, $2, $3) RETURNING id, meal_id, food_id, quantity`,
    [mealId, foodId, quantity]
  )
  const entry = entryResult.rows[0]

  res.status(201).json(entry)

}

export const updateEntry = async (req, res) => {
  const {entryId} = req.params
  const {quantity} = req.body

  if (quantity === undefined || quantity < 0) throw new BadRequestError("Provide a valid quantity");

  if (quantity === 0) {
    const result = await pool.query(
      `DELETE
       FROM meal_entries
       WHERE id = $1 RETURNING id`,
      [entryId]
    )

    if (result.rowCount === 0) throw new BadRequestError("Entry not found")

    return res.status(200).send({msg: "Entry deleted"})

  }

  const updateResult = await pool.query(
    `UPDATE meal_entries
     SET quantity = $1
     WHERE id = $2 RETURNING id, meal_id, food_id, quantity`,
    [quantity, entryId]
  )

  if (updateResult.rowCount === 0) throw new BadRequestError("Entry not found")

  res.status(200).json(updateResult.rows[0])
}

export const deleteEntry = async (req, res) => {
  const {entryId} = req.params;

  const result = await pool.query(
    "DELETE FROM meal_entries WHERE id = $1 RETURNING id",
    [entryId]
  );

  if (result.rowCount === 0) {
    throw new BadRequestError("Entry not found");
  }

  return res.status(204).send();
}

export const getEntry = async (req, res) => {
  const {entryId} = req.params

  if (!entryId) throw new BadRequestError("Please provide a entry id")

  const result = await pool.query(
    `SELECT *
     FROM meal_entries
     WHERE id = $1`,
    [entryId]
  )

  if (result.rowCount === 0) throw new NotFoundError("Entry not found")

  res.status(200).json(result.rows[0])
}

