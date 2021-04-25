import { app as server } from './server';
import { db } from './db';

const main = async () => {
	const PORT = process.env.PORT || 5000;
	/* move to script to execute
	await db.query('DROP TABLE IF EXISTS google_auth.users;');
	await db.query(`CREATE TABLE google_auth.users (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			first_name VARCHAR(50),
			last_name VARCHAR(50),
			email VARCHAR(50) NOT NULL
	);`);
	*/
	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
};

main();
