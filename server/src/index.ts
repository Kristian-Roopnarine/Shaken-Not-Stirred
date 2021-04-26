import { app as server } from './server';
import { db, config } from './db';
import { getUserByEmail } from './sql/users/get';

const main = async () => {
  const PORT = process.env.PORT || 5000;
  /* move to script to execute
  await db.query(`DROP TABLE IF EXISTS ${config.TABLE_NAMES.users};`);
  await db.query(`CREATE TABLE ${config.TABLE_NAMES.users}(
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			first_name VARCHAR(50),
			last_name VARCHAR(50),
			email VARCHAR(50) NOT NULL
	);`);
  await db.query(`CREATE TABLE ${config.TABLE_NAMES.matches}(
			id SERIAL PRIMARY KEY,
			user_id UUID REFERENCES ${config.TABLE_NAMES.users}(id) ON DELETE CASCADE,
			drink_id INTEGER NOT NULL,
      drink_name VARCHAR(75) NOT NULL
	);`);
	*/

  let userResult = await db.query(getUserByEmail, [
    'kristian.roopnarine@gmail.com',
  ]);
  let user = userResult.rows[0];
  if (!user) {
    await db.query(
      `INSERT INTO ${config.TABLE_NAMES.users}(email,first_name,last_name) VALUES($1,$2,$3);`,
      ['kristian.roopnarine@gmail.com', 'kristian', 'roopnarine']
    );
    userResult = await db.query(getUserByEmail, [
      'kristian.roopnarine@gmail.com',
    ]);
    user = userResult.rows[0];
  }

  const drinkMatches = await db.query(
    `SELECT * FROM ${config.TABLE_NAMES.matches};`
  );

  if (drinkMatches.rows.length !== 2) {
    await db.query(
      `INSERT INTO ${config.TABLE_NAMES.matches}(user_id,drink_id,drink_name) VALUES ($1,$2,$3), ($4,$5,$6)`,
      [user.id, '11000', 'Corona', user.id, '11001', 'Heineken']
    );
  }
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main();
