import express from 'express';
import { getQuizBySlug, submitQuizAttempt } from './quiz.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:slug', protect, getQuizBySlug);
router.post('/:slug/attempt', protect, submitQuizAttempt);

export default router;
