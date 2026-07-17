import express from 'express';
import { getExperiments, getExperimentBySlug, getSubmission, saveSubmission } from './experiment.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getExperiments);
router.get('/:slug', protect, getExperimentBySlug);
router.get('/:slug/submission', protect, getSubmission);
router.post('/:slug/submission', protect, saveSubmission);

export default router;
