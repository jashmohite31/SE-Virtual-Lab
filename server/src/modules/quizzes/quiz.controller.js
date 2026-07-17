import { Quiz } from './quiz.model.js';
import { QuizAttempt } from './quizAttempt.model.js';
import { Experiment } from '../experiments/experiment.model.js';
import { Progress } from '../progress/progress.model.js';
import { Certificate } from '../certificates/certificate.model.js';
import { User } from '../users/user.model.js';
import { AppError } from '../../utils/AppError.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getQuizBySlug = asyncHandler(async (req, res, next) => {
  const experiment = await Experiment.findOne({ slug: req.params.slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }

  const quiz = await Quiz.findOne({ experiment: experiment._id });
  if (!quiz) {
    return next(new AppError('Quiz not found for this experiment.', 404));
  }

  // Map to exclude correct index for client-side privacy, send only questions and options
  const sanitizedQuestions = quiz.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options
  }));

  res.status(200).json({
    status: 'success',
    data: {
      quizId: quiz._id,
      questions: sanitizedQuestions
    }
  });
});

export const submitQuizAttempt = asyncHandler(async (req, res, next) => {
  const { answers } = req.body; // Array of { questionId, selectedIndex }
  const experiment = await Experiment.findOne({ slug: req.params.slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }

  const quiz = await Quiz.findOne({ experiment: experiment._id });
  if (!quiz) {
    return next(new AppError('Quiz not found.', 404));
  }

  let correctCount = 0;
  const gradedAnswers = quiz.questions.map((question) => {
    const userAnswer = answers.find((ans) => ans.questionId === question._id.toString());
    const selectedIndex = userAnswer ? userAnswer.selectedIndex : -1;
    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) correctCount++;

    return {
      questionId: question._id.toString(),
      selectedIndex,
      isCorrect,
      correctIndex: question.correctIndex, // Return details to student after submit
      explanation: question.explanation
    };
  });

  const percentageScore = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = percentageScore >= 60; // 60% passing criteria

  const attempt = await QuizAttempt.create({
    user: req.user.id,
    quiz: quiz._id,
    answers: gradedAnswers.map((ans) => ({
      questionId: ans.questionId,
      selectedIndex: ans.selectedIndex,
      isCorrect: ans.isCorrect
    })),
    score: percentageScore,
    passed
  });

  // Fetch or update progress
  let progress = await Progress.findOne({ user: req.user.id, experiment: experiment._id });
  if (!progress) {
    progress = new Progress({ user: req.user.id, experiment: experiment._id });
  }

  if (passed) {
    progress.quizCompleted = true;
  }
  if (percentageScore > progress.maxQuizScore) {
    progress.maxQuizScore = percentageScore;
  }
  await progress.save();

  // If passed and activity is also completed, issue certificate
  let certificate = null;
  if (progress.activityCompleted && progress.quizCompleted && !progress.certificateIssued) {
    const userDetails = await User.findById(req.user.id);
    const serial = `CERT-${req.user.id.toString().substring(18).toUpperCase()}-${experiment._id.toString().substring(18).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    certificate = await Certificate.create({
      user: req.user.id,
      experiment: experiment._id,
      serialNumber: serial,
      metadataSnapshot: {
        studentName: userDetails.name,
        experimentTitle: experiment.title,
        score: progress.maxQuizScore
      }
    });

    progress.certificateIssued = true;
    await progress.save();
  } else if (progress.certificateIssued) {
    certificate = await Certificate.findOne({ user: req.user.id, experiment: experiment._id });
  }

  res.status(200).json({
    status: 'success',
    data: {
      score: percentageScore,
      passed,
      attemptId: attempt._id,
      questions: quiz.questions.map((q, idx) => ({
        questionText: q.questionText,
        options: q.options,
        selectedIndex: gradedAnswers[idx].selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect: gradedAnswers[idx].isCorrect,
        explanation: q.explanation
      })),
      certificate
    }
  });
});
export default { getQuizBySlug, submitQuizAttempt };
