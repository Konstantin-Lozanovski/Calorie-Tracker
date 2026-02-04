import pkg from "pg"
const { Pool } = pkg

import dotenv from "dotenv";
dotenv.config();  // <--- FIX


export const pool = new Pool({
  user: process.env.DB_USER, // your DB username
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // your database name
  password: process.env.DB_PASSWORD, // your DB password
  port: 5432, // default PostgreSQL port
})
