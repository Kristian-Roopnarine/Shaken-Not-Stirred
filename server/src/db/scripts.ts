import { QueryResult } from 'pg';
import { userTypes } from '../types';
import { db, config } from './index';

// change table name for new test tables

async function createTestUserTable() {
  await db.query(`CREATE TABLE ${config.TABLE_NAMES.users} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(50) NOT NULL
);`);
}

async function createTestMatchesTable() {
  await db.query(`CREATE TABLE ${config.TABLE_NAMES.matches}(
			id SERIAL PRIMARY KEY,
			user_id UUID REFERENCES ${config.TABLE_NAMES.users}(id) ON DELETE CASCADE,
			drink_id INTEGER NOT NULL,
      drink_name VARCHAR(75) NOT NULL
	);`);
}

export async function initializeTestDatabase() {
  // need to delete matches first because of FK relationship to users
  await db.query(`DROP TABLE IF EXISTS ${config.TABLE_NAMES.matches}`);
  await db.query(`DROP TABLE IF EXISTS ${config.TABLE_NAMES.users}`);
  await createTestUserTable();
  await createTestMatchesTable();
}

export async function dropAllTestSchema() {
  await db.query('DROP SCHEMA test CASCADE');
  await db.query('CREATE SCHEMA test');
}

export async function insertTestUser(
  email: string,
  first_name?: string,
  last_name?: string
) {
  await db.query(
    `INSERT INTO ${config.TABLE_NAMES.users}(email,first_name,last_name) VALUES ($1, $2, $3)`,
    [email, first_name, last_name]
  );
}

export async function insertTestMatch(
  user_id: string,
  drink_id: string,
  drink_name: string
) {
  await db.query(
    `INSERT INTO ${config.TABLE_NAMES.matches}(user_id,drink_id,drink_name) VALUES ($1, $2, $3)`,
    [user_id, drink_id, drink_name]
  );
}

export async function selectTestUserId(email: string): Promise<userTypes.User> {
  const result: QueryResult<any> = await db.query(
    `SELECT id FROM ${config.TABLE_NAMES.users} WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}
