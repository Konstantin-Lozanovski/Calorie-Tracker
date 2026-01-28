--Get daily log by date with all meals and foods
SELECT
    d.id, d.date, d.weight,
    (
        SELECT json_agg(
                       json_build_object(
                               'id', m.id,
                               'name', m.name,
                               'entries', (
                                   SELECT json_agg(
                                                  json_build_object(
                                                          'id', me.id,
                                                          'quantity', me.quantity,
                                                          'food', (
                                                              SELECT json_build_object(
                                                                             'id', f.id,
                                                                             'name', f.name,
                                                                             'calories', f.calories,
                                                                             'protein', f.protein,
                                                                             'carbs', f.carbs,
                                                                             'fat', f.fat
                                                                     ) FROM foods f WHERE f.id = me.food_id
                                                          )
                                                  )
                                          ) FROM meal_entries me WHERE me.meal_id = m.id
                               )
                       )
               ) FROM meals m WHERE m.daily_log_id = d.id
    ) AS meals
FROM daily_logs d
WHERE d.date = $1 AND d.user_id = $2;