import express from 'express';
import { getQuizBySlug, submitQuizAttempt, getQuizAttempts } from './quiz.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:slug', protect, getQuizBySlug);
router.get('/:slug/attempts', protect, getQuizAttempts);
router.post('/:slug/attempt', protect, submitQuizAttempt);

export default router;
