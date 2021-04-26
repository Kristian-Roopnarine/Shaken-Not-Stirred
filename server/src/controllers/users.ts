import { Response } from 'express';
import { authTypes } from './../types';

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
