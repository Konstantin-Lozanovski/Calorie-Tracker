import pkg from "pg"
const { Pool } = pkg

export const pool = new Pool({
  user: "konstantin", // your DB username
  host: "localhost",
  database: "Calorie-Tracker", // your database name
  password: "konstantin2004", // your DB password
  port: 5432, // default PostgreSQL port
})
