import { Application } from 'express';
import { router as authRouter } from './auth';
import { router as userRouter } from './users';
import { router as matchesRouter } from './matches';

const mountRoutes = (app: Application) => {
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/matches', matchesRouter);
};

export default mountRoutes;
