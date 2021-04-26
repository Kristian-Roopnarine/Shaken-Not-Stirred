import express from 'express';
import { fetchCurrentUser } from '../controllers/auth';
import { protect } from '../middleware';
const router = express.Router();

router.route('/me').get(protect, fetchCurrentUser);

export { router };
