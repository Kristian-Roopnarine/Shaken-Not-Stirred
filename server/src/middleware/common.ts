import jwt = require('jsonwebtoken');
import { Response, NextFunction } from 'express';
import { QueryResult } from 'pg';
const { promisify } = require('util');

import { db } from './../db';
import { AuthenticatedRequest } from '../types/auth';
import { userTypes } from '../types';
import { getTestUserById, getUserById } from '../sql/users/get';
import { CustomError } from '../../utils';

export function signToken(id: string) {
  return jwt.sign({ id }, 'replaceme', { expiresIn: '1d' });
}

export async function protect(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | null = null;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new CustomError('Please log in!', 400));
  }

  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, 'replaceme');
  } catch (err) {
    // TokenExpiredError
    return next(new CustomError('Invalid JWT signature', 400));
  }

  // User is assumed to have existed at one point because they have a jwt
  // can they use a jwt from another site?
  // fix this!!
  let result: QueryResult<any>;
  if (process.env.NODE_ENV === 'test') {
    result = await db.query(getTestUserById, [decoded.id]);
  } else {
    result = await db.query(getUserById, [decoded.id]);
  }

  const user: userTypes.User = result.rows[0];

  if (!user) {
    return next(new CustomError('Error finding user', 404));
  }

  req.user = user;

  next();
}
