import express from 'express';
import { login, fetchCurrentUser } from '../controllers/auth';
import { protect } from '../middleware';
import { convertTokenToUserPayload } from './../middleware/auth';
const router = express.Router();

router.route('/login').post(convertTokenToUserPayload, login);
router.route('/me').get(protect, fetchCurrentUser);

export { router };
