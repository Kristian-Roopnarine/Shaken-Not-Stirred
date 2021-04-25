import { Response } from 'express';
import { authTypes } from './../types';
import { QueryResult } from 'pg';

import { db } from './../db';
import { getUserByEmail } from '../sql/users/get';
import { insertNewUser } from '../sql/users/insert';
import { signToken } from './../middleware/common';
import { userTypes } from './../types';

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

export async function login(req: authTypes.GoogleAuthLogin, res: Response) {
  // if it makes it here then there is a user on the request object
  const { email, family_name, given_name } = req.user!;
  const result: QueryResult<userTypes.User> = await db.query(getUserByEmail, [
    email,
  ]);
  // should I put the logic to create the user here?
  let user: userTypes.User = result.rows[0];
  if (!user) {
    // turn this into transaction
    await db.query(insertNewUser, [email, given_name, family_name]);
    const newUser: QueryResult<userTypes.User> = await db.query(
      getUserByEmail,
      [email]
    );
    user = newUser.rows[0];
  }
  const { id } = user;
  const token = signToken(id);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.status(200).cookie('jwt', token, cookieOptions).json({
    status: 'Success',
    message: 'Logged in',
  });
}

// maybe should go to a users resource
export async function fetchCurrentUser(
  req: authTypes.AuthenticatedRequest,
  res: Response
) {
  const { email } = req.user!;
  res.status(200).json({
    message: "You're currently logged in!",
    email,
  });
}
