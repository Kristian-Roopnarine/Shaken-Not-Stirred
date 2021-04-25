import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { NextFunction, Response } from 'express';
import { authTypes } from './../types';
import { CustomError } from '../../utils';
// update with your client ID
const { CLIENT_ID } = process.env;

const client = new OAuth2Client(CLIENT_ID);

export async function convertTokenToUserPayload(
  req: authTypes.GoogleAuthLogin,
  res: Response,
  next: NextFunction
): Promise<Error | void> {
  // simulate test when there is no token
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload: TokenPayload | undefined = ticket.getPayload();

  // type guard
  if (!payload) {
    return next(new CustomError('Google Auth Error', 500));
  }

  const { email, sub, given_name, family_name } = payload;
  req.user = {
    email,
    sub,
    given_name,
    family_name,
  };
  next();
}
