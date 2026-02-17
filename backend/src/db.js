import pkg from "pg"
const { Pool } = pkg

import {DB_USER, DB_HOST, DB_NAME, DB_PASSWORD} from "./config/env.js"

export const pool = new Pool({
  user: DB_USER, // your DB username
  host: DB_HOST,
  database: DB_NAME, // your database name
  password: DB_PASSWORD, // your DB passwordd
  port: 5432, // default PostgresSQL port
})
