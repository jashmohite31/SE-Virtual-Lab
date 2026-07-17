import express from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
