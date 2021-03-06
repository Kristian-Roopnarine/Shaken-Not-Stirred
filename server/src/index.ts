import { app as server } from './server';
import { db, config } from './db';

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
			user_id UUID REFERENCES ${config.TABLE_NAMES.users}(id),
			drink_id INTEGER NOT NULL,
      drink_name VARCHAR(75) NOT NULL
	);`);
	*/
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main();
