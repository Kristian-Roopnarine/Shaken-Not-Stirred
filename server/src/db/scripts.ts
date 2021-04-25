import { QueryResult } from 'pg';
import { userTypes } from '../types';
import { db, config } from './index';

// change table name for new test tables

export async function initializeTestDatabase() {
  await db.query(`DROP TABLE IF EXISTS ${config.TABLE_NAMES.users}`);
  await db.query(`CREATE TABLE ${config.TABLE_NAMES.users} (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(50) NOT NULL
);`);
}

export async function dropAllTestSchema() {
  await db.query('DROP SCHEMA google_auth_test CASCADE');
  await db.query('CREATE SCHEMA google_auth_test');
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

export async function selectTestUserId(email: string): Promise<userTypes.User> {
  const result: QueryResult<any> = await db.query(
    `SELECT id FROM ${config.TABLE_NAMES.users} WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}
