import { NextFunction, Response } from 'express';
import { QueryResult } from 'pg';
import axios from 'axios';

import { db } from './../db';
import { getAllMatchesForUser } from '../sql/matches/get';
import { userMatchTypes } from '../types';
import { AuthenticatedRequest } from '../types/auth';
import { CustomError } from '../../utils';

// got the algorithm down to fetch drinks from the api
// need to return drink_name, picture
export async function getAllUserMatches(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // if it makes it here then there is a user on the request object
  const { id } = req.user!;
  let result: QueryResult<userMatchTypes.UserMatch>;
  try {
    result = await db.query(getAllMatchesForUser, [id]);
  } catch (err) {
    console.log({ err });
    return next(new CustomError('Server error', 500));
  }

  let drinkMatches: Array<userMatchTypes.UserMatch> = result.rows;
  let drinkApiResponse;
  // make call to cocktailDB to get photo and name
  try {
    let drinkCall: Array<Promise<any>> = drinkMatches.map((drink) => {
      return axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.drink_id}`
      );
    });

    drinkApiResponse = await Promise.all(drinkCall);
  } catch (err) {
    console.log(err);
  }

  let drinkData = drinkApiResponse?.map((response) => response.data);
  res.status(200).json({
    status: 'success',
    data: drinkData,
  });
}
