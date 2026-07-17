import express from 'express';
import { getMyProgress } from './progress.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyProgress);

export default router;
