import express from 'express';
import { getMyProgress, getExperimentProgress, updateExperimentProgress } from './progress.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyProgress);
router.get('/:slug', protect, getExperimentProgress);
router.post('/:slug', protect, updateExperimentProgress);

export default router;
