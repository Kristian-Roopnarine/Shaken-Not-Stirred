import { Request, Response, NextFunction, response } from 'express';
import { globalErrorHandler } from '../../controllers/error';
import { CustomError } from '../../../utils';

function returnCustomError(msg: string, code: number): CustomError {
  return new CustomError(msg, code);
}

function returnMocked(
  mockError: CustomError,
  mockRequest: Request,
  mockResponse: Response,
  nextFunction: NextFunction
) {
  return globalErrorHandler(mockError, mockRequest, mockResponse, nextFunction);
}

function returnTestCaseFactory(
  msg: string,
  code: number,
  mockRequest: Request,
  mockResponse: Response,
  nextFunction: NextFunction
) {
  let message = msg;
  let mockError = returnCustomError(message, code);
  let expectedResponse = {
    status: mockError.status,
    message: msg,
  };
  return () => {
    returnMocked(mockError, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toBeCalledWith(400);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  };
}

describe('Global Error Handler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: Partial<NextFunction>;
  let mockArgs: [Request, Response, NextFunction];
  beforeEach(async () => {
    mockRequest = {};
    mockResponse = {
      // returns the default object to chain json method
      status: jest.fn(function (code: number): Response {
        return mockResponse as Response;
      }),
      json: jest.fn(),
    };
    mockArgs = [
      mockRequest as Request,
      mockResponse as Response,
      nextFunction as NextFunction,
    ];
  });

  describe('protect middleware', () => {
    test('No JWT token error', async () => {
      returnTestCaseFactory('Please log in!', 400, ...mockArgs);
    });

    test('Invalid JWT error', async () => {
      returnTestCaseFactory('Invalid JWT signature', 400, ...mockArgs);
    });
    test('User does not exist', async () => {
      returnTestCaseFactory('Error finding user', 404, ...mockArgs);
    });
  });
});
