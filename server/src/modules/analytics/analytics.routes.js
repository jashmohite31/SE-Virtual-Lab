import express from 'express';
import { getDashboardAnalytics } from './analytics.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);

export default router;
