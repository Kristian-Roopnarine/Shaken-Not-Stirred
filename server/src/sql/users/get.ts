import { config } from './../../db';
export const getUserById = `SELECT id,email FROM ${config.TABLE_NAMES.users} WHERE id = $1`;

export const getUserByEmail = `SELECT id,email FROM ${config.TABLE_NAMES.users} WHERE email = $1`;
export const getTestUserById = `SELECT id,email FROM ${config.TABLE_NAMES.users} WHERE id = $1`;
