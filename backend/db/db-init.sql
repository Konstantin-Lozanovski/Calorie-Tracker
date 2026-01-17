-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL;
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    calorie_goal INTEGER DEFAULT 2000,
    protein_goal_pct INTEGER DEFAULT 20,
    carbs_goal_pct INTEGER DEFAULT 60,
    fat_goal_pct INTEGER DEFAULT 20,
    weight_goal NUMERIC DEFAULT NULL,
    -- This line ensures the math is always correct at the database level
    CONSTRAINT check_macro_sum CHECK (protein_goal_pct + carbs_goal_pct + fat_goal_pct = 100)
    );

-- 2. Foods Table (The catalog of all available foods)
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    calories NUMERIC NOT NULL, -- per serving
    protein NUMERIC NOT NULL,
    carbs NUMERIC NOT NULL,
    fat NUMERIC NOT NULL,
    serving_unit VARCHAR(50) -- e.g. 'grams', 'slice'
    );

-- 3. Daily Logs (Linking a specific Date to a User)
CREATE TABLE IF NOT EXISTS daily_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    weight NUMERIC,
    UNIQUE(user_id, date) -- User can't have two logs for the same day
    );

-- 4. Meals (Breakfast, Lunch, Dinner and Snack within a Daily Log)
CREATE TYPE meal_type AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snacks');

CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    daily_log_id INTEGER REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL,
    meal meal_type NOT NULL,
    meal_order INTEGER NOT NULL,
    UNIQUE(daily_log_id, meal)
    );

-- 5. Meal Entries (The bridge/associative table between Meals and Foods)
CREATE TABLE IF NOT EXISTS meal_entries (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
    food_id INTEGER REFERENCES foods(id) NOT NULL,
    quantity NUMERIC NOT NULL -- Amount of serving_unit
    );

CREATE UNIQUE INDEX idx_daily_logs_user_date
    ON daily_logs (user_id, date)

CREATE INDEX idx_food_name_lower
    ON foods (LOWER(name));

CREATE INDEX idx_food_brand_lower
    ON foods (LOWER(COALESCE(brand, '')));






