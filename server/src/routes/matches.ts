import express from 'express';
import { protect } from '../middleware';
import { matchesControllers } from './../controllers';
const router = express.Router();

// get all for user
router.route('/').get(protect, matchesControllers.getAllUserMatches);

export { router };
