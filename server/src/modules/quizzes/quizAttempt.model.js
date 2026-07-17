import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionId: { type: String, required: true },
    selectedIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  score: { type: Number, required: true }, // Score percentage (0 to 100)
  passed: { type: Boolean, required: true }
}, { timestamps: true });

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
