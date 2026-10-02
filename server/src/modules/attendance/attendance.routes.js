import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { restrictTo } from '../../middleware/roleGuard.js';
import * as attendanceController from './attendance.controller.js';

const router = express.Router();

router.use(protect);

// Teacher routes
router.post('/sessions', restrictTo('teacher', 'admin'), attendanceController.createSession);
router.get('/sessions', restrictTo('teacher', 'admin'), attendanceController.getTeacherSessions);
router.get('/sessions/:sessionId', restrictTo('teacher', 'admin'), attendanceController.getSessionAttendance);

// Student routes
router.post('/join', restrictTo('student'), attendanceController.joinSession);
router.post('/mark', restrictTo('student'), attendanceController.markAttendance);

export default router;
