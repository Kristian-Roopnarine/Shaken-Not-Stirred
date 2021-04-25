import { Application } from 'express';
import { router as authRouter } from './auth';

const mountRoutes = (app: Application) => {
  app.use('/auth', authRouter);
};

export default mountRoutes;
