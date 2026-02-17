import {config} from 'dotenv';

config({path: `.env`})

export const {
  PORT,
  JWT_SECRET,
  JWT_LIFETIME,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST
} = process.env