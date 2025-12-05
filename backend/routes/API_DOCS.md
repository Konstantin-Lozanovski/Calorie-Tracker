--DONE________________________________________________________


-- Auth Routes
POST /api/auth/register          -- Create account
POST /api/auth/login             -- Log in & get token

-- User Routes
GET /api/user/me                 -- Get profile & goals
PUT /api/user/goals              -- Update calorie/macro goals



--NOT DONE____________________________________________________



-- Daily Logs Routes
GET /api/days/:date              -- Get log (auto-creates if missing) returns all meals and foods in those meals
GET /api/days/history            -- Get list of past days
PUT /api/days/:date/weight       -- Update weight for a date

-- Meal Routes
POST /api/days/:date/meals       -- Add new meal (e.g. "Pre-Workout")

-- Meal Entries Routes
DELETE /api/meals/:mealId        -- Delete a custom meal
GET /api/meals/:mealId/entries   -- Get foods in a specific meal
POST /api/meals/:mealId/entries  -- Add food to a meal
PUT /api/meals/entries/:entryId        -- Update quantity of an entry
DELETE /api/meals/entries/:entryId     -- Remove food from a meal

-- Food Routes
GET /api/foods?search=...        -- Search for foods
POST /api/foods                  -- Create a new custom food
