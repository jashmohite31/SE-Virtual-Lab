import express from 'express';
import { getMyNotifications, markAsRead } from './notification.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markAsRead);

export default router;
