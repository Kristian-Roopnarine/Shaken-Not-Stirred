import { config } from './../../db';
const { matches, users } = config.TABLE_NAMES;

export const getAllMatchesForUser = `
SELECT drink_id
FROM ${matches}
JOIN ${users} ON ${users}.id = ${matches}.user_id
WHERE ${users}.id = $1;
`;
