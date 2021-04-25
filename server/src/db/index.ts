import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from './config';
dotenv.config();

const { DB_USER, DB_PASSWORD, DATABASE, DB_HOST, DB_PORT } = process.env;
const pool: Pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DATABASE,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT!),
});

// is there a better way to define any type for params?
const db = {
  query: (text: string, params?: any) => pool.query(text, params),
};

export { config, db };
