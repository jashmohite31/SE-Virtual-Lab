import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import experimentRoutes from '../modules/experiments/experiment.routes.js';
import quizRoutes from '../modules/quizzes/quiz.routes.js';
import progressRoutes from '../modules/progress/progress.routes.js';
import certificateRoutes from '../modules/certificates/certificate.routes.js';
import notificationRoutes from '../modules/notifications/notification.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/experiments', experimentRoutes);
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);
router.use('/certificates', certificateRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
