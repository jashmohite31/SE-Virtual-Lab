import { AttendanceSession, AttendanceRecord } from './attendance.model.js';
import { AppError } from '../../utils/AppError.js';

// --- Teacher Controllers ---

export const createSession = async (req, res, next) => {
  try {
    const { durationMinutes, className, semester } = req.body;
    if (!durationMinutes || !className || !semester) {
      return next(new AppError('Duration, Class Name, and Semester are required', 400));
    }

    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const session = await AttendanceSession.create({
      teacherId: req.user.id,
      classCode,
      className,
      semester,
      durationMinutes,
      expiresAt,
    });

    res.status(201).json({
      status: 'success',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

export const getTeacherSessions = async (req, res, next) => {
  try {
    const sessions = await AttendanceSession.find({ teacherId: req.user.id }).sort('-createdAt');
    res.status(200).json({
      status: 'success',
      data: { sessions },
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await AttendanceSession.findOne({ _id: sessionId, teacherId: req.user.id });
    if (!session) {
      return next(new AppError('Session not found', 404));
    }

    const records = await AttendanceRecord.find({ sessionId }).populate('studentId', 'name email');
    res.status(200).json({
      status: 'success',
      data: { session, records },
    });
  } catch (error) {
    next(error);
  }
};

// --- Student Controllers ---

export const joinSession = async (req, res, next) => {
  try {
    const { classCode } = req.body;
    if (!classCode) {
      return next(new AppError('Class code is required', 400));
    }

    const session = await AttendanceSession.findOne({ classCode, isActive: true });
    if (!session) {
      return next(new AppError('Invalid or inactive class code', 404));
    }

    if (new Date() > session.expiresAt) {
      session.isActive = false;
      await session.save();
      return next(new AppError('This session has expired', 400));
    }

    let record = await AttendanceRecord.findOne({ sessionId: session._id, studentId: req.user.id });
    if (!record) {
      record = await AttendanceRecord.create({
        sessionId: session._id,
        studentId: req.user.id,
      });
    }

    res.status(200).json({
      status: 'success',
      data: { session, record },
    });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return next(new AppError('Session ID is required', 400));
    }

    const record = await AttendanceRecord.findOne({ sessionId, studentId: req.user.id });
    if (!record) {
      return next(new AppError('Record not found. Did you join the session?', 404));
    }

    record.status = 'present';
    await record.save();

    res.status(200).json({
      status: 'success',
      data: { record },
    });
  } catch (error) {
    next(error);
  }
};
