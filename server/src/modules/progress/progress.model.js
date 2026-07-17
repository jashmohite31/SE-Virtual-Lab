import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  experiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiment', required: true },
  activityCompleted: { type: Boolean, default: false },
  quizCompleted: { type: Boolean, default: false },
  maxQuizScore: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false }
}, { timestamps: true });

progressSchema.index({ user: 1, experiment: 1 }, { unique: true });

export const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
