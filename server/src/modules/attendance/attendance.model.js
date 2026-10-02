import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classCode: {
    type: String,
    required: true,
    unique: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const attendanceRecordSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceSession',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  joinTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'present'],
    default: 'pending',
  },
}, { timestamps: true });

export const AttendanceSession = mongoose.model('AttendanceSession', attendanceSessionSchema);
export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
