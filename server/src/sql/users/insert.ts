import { config } from './../../db';
export const insertNewUser = `INSERT INTO ${config.TABLE_NAMES.users} (email,first_name,last_name) VALUES ($1,$2,$3)`;
