import { Request, Response, NextFunction } from 'express';
import { CustomError } from './../../utils/customError';

interface ExpressError {
  status: string;
  message: string;
  stack?: any;
  name?: any;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fullError: ExpressError = {
    status: err.status,
    message: err.message,
  };
  if (process.env.NODE_ENV === 'development') {
    fullError.stack = err.stack;
    fullError.name = err.name;
  }
  return res.status(err.statusCode).json(fullError);
};

export { globalErrorHandler };
