import { pool } from "../src/db.js"
import {BadRequestError} from "../errors/index.js";

export const getDay = async (req, res) => {
  const { date } = req.params;
  const userId = req.user.id;

  const client = await pool.connect(); // get a dedicated client
  try {
    await client.query('BEGIN'); // start transaction

    // 1. Try inserting the daily log
    const insertLog = await client.query(
      `INSERT INTO daily_logs (user_id, date)
       VALUES ($1, $2)
       ON CONFLICT (user_id, date) DO NOTHING
       RETURNING id, user_id, date::text, weight`,
      [userId, date]
    );

    let dailyLog;

    if (insertLog.rows.length === 0) {
      // log already exists → fetch it
      const existing = await client.query(
        `SELECT id, user_id, date::text, weight
         FROM daily_logs
         WHERE user_id = $1 AND date = $2`,
        [userId, date]
      );
      dailyLog = existing.rows[0];
    } else {
      // newly created log
      dailyLog = insertLog.rows[0];

      // create default meals
      const logId = dailyLog.id;
      const defaultMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

      for (let i = 0; i < defaultMeals.length; i++) {
        await client.query(
          `INSERT INTO meals (daily_log_id, meal, meal_order)
           VALUES ($1, $2, $3)`,
          [logId, defaultMeals[i], i + 1]
        );
      }
    }

    // 2. Fetch meals + entries for this log
    const mealsResult = await client.query(
      `SELECT 
         m.id as meal_id, 
         m.meal as meal_name,
         me.id as entry_id,
         me.quantity,
         f.id as food_id,
         f.name as food_name,
         f.brand as brand_name,
         f.calories,
         f.protein,
         f.carbs,
         f.fat,
         f.serving_unit
       FROM meals m
       LEFT JOIN meal_entries me ON m.id = me.meal_id
       LEFT JOIN foods f ON me.food_id = f.id
       WHERE m.daily_log_id = $1
       ORDER BY m.meal_order, me.id`,
      [dailyLog.id]
    );

    // 3. Structure the data
    const mealsMap = new Map();
    mealsResult.rows.forEach(row => {
      if (!mealsMap.has(row.meal_id)) {
        mealsMap.set(row.meal_id, {
          id: row.meal_id,
          name: row.meal_name,
          entries: []
        });
      }

      if (row.entry_id) {
        mealsMap.get(row.meal_id).entries.push({
          id: row.entry_id,
          quantity: row.quantity,
          food: {
            id: row.food_id,
            name: row.food_name,
            brand: row.brand_name,
            calories: Number(row.calories),
            protein: Number(row.protein),
            carbs: Number(row.carbs),
            fat: Number(row.fat),
            serving_unit: row.serving_unit
          }
        });
      }
    });

    const responseData = {
      ...dailyLog,
      meals: Array.from(mealsMap.values())
    };

    await client.query('COMMIT'); // commit transaction
    res.status(200).json(responseData);

  } catch (err) {
    await client.query('ROLLBACK'); // rollback if anything fails
    throw err; // let your error handler handle it
  } finally {
    client.release(); // release the client back to the pool
  }
};


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

