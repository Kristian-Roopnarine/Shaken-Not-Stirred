import { NextFunction, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { protect } from './../../middleware';
import { authTypes } from './../../types';
import {
  initializeTestDatabase,
  insertTestUser,
  selectTestUserId,
  dropAllTestSchema,
} from './../../db/scripts';
import jwt = require('jsonwebtoken');

import { CustomError } from './../../../utils';

describe('JWT middleware', () => {
  let mockRequest: Partial<authTypes.AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction = jest.fn() as jest.Mock<NextFunction>;
  let mockArgs: [
    authTypes.AuthenticatedRequest,
    Response,
    jest.Mock<NextFunction>
  ];

  beforeEach(async () => {
    await initializeTestDatabase();
    mockRequest = {
      cookies: {
        jwt: null,
      },
    };
    mockResponse = {
      json: jest.fn(),
    };
    nextFunction.mockReset();
    nextFunction = jest.fn();
    mockArgs = [
      mockRequest as authTypes.AuthenticatedRequest,
      mockResponse as Response,
      nextFunction,
    ];
  });

  afterAll(async () => {
    await dropAllTestSchema();
  });

  test('login without token', async () => {
    await protect(...mockArgs);
    expect(nextFunction).toBeCalledWith(new CustomError('Please log in!', 400));
  });

  test('expired jwt', async () => {
    let token = jwt.sign(
      { id: 1234, exp: Math.floor(Date.now() / 1000) - 10 },
      'replaceme'
    );

    mockRequest.cookies.jwt = token;

    await protect(...mockArgs);
    expect(nextFunction).toBeCalledWith(
      new CustomError('Invalid JWT signature', 400)
    );
  });

  test('user does not exist', async () => {
    let testUUID = uuidv4();
    let token = jwt.sign({ id: testUUID }, 'replaceme');
    mockRequest.cookies.jwt = token;

    await protect(...mockArgs);
    expect(nextFunction).toBeCalledWith(
      new CustomError('Error finding user', 404)
    );
  });

  test('Valid JWT and user exists', async () => {
    await insertTestUser('bob@bob.com');

    const { id } = await selectTestUserId('bob@bob.com');

    let token = jwt.sign({ id }, 'replaceme');
    mockRequest.cookies.jwt = token;

    await protect(...mockArgs);
    expect(nextFunction).toBeCalledTimes(1);
    expect(nextFunction).toBeCalledWith();
  });
});
