import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  experiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiment', required: true, unique: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' }
  }]
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
