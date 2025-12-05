-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    calorie_goal INTEGER DEFAULT 2000,
    protein_goal_pct INTEGER DEFAULT 40,
    carbs_goal_pct INTEGER DEFAULT 40,
    fat_goal_pct INTEGER DEFAULT 20,
    -- This line ensures the math is always correct at the database level
    CONSTRAINT check_macro_sum CHECK (protein_goal_pct + carbs_goal_pct + fat_goal_pct = 100)
    );

-- 2. Foods Table (The catalog of all available foods)
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    calories NUMERIC NOT NULL, -- per serving
    protein NUMERIC DEFAULT 0,
    carbs NUMERIC DEFAULT 0,
    fat NUMERIC DEFAULT 0,
    serving_unit VARCHAR(50) -- e.g. 'grams', 'slice'
    );

-- 3. Daily Logs (Linking a specific Date to a User)
CREATE TABLE IF NOT EXISTS daily_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    weight NUMERIC,
    UNIQUE(user_id, date) -- User can't have two logs for the same day
    );

-- 4. Meals (Breakfast, Lunch, etc. within a Daily Log)
CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    daily_log_id INTEGER REFERENCES daily_logs(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL -- 'Breakfast', 'Lunch', etc.
    );

-- 5. Meal Entries (The bridge/associative table between Meals and Foods)
CREATE TABLE IF NOT EXISTS meal_entries (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id),
    quantity NUMERIC NOT NULL -- Amount of serving_unit
    );
