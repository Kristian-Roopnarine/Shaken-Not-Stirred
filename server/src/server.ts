import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { globalErrorHandler } from './controllers/error';
import { CustomError } from './../utils/';
import mountRoutes from './routes';

export const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

mountRoutes(app);
app.get('/', (req: Request, res: Response) => {
  res.json({
    statusCode: 200,
    message: 'sent',
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new CustomError(
      `Could not find the request URL ${req.protocol}://${req.hostname}${req.url}`,
      404
    )
  );
});

app.use(globalErrorHandler);
