import { Progress } from '../progress/progress.model.js';
import { User } from '../users/user.model.js';
import { Experiment } from '../experiments/experiment.model.js';
import { Certificate } from '../certificates/certificate.model.js';
import { QuizAttempt } from '../quizzes/quizAttempt.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getDashboardAnalytics = asyncHandler(async (req, res, next) => {
  const { role, id: userId } = req.user;

  if (role === 'student') {
    const totalExperiments = await Experiment.countDocuments();
    const progressList = await Progress.find({ user: userId });

    const completedActivities = progressList.filter(p => p.activityCompleted).length;
    const completedQuizzes = progressList.filter(p => p.quizCompleted).length;
    const certificatesCount = progressList.filter(p => p.certificateIssued).length;

    const quizScores = progressList.filter(p => p.quizCompleted).map(p => p.maxQuizScore);
    const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

    res.status(200).json({
      status: 'success',
      data: {
        role,
        stats: {
          totalExperiments,
          completedActivities,
          completedQuizzes,
          certificatesCount,
          avgQuizScore,
          overallProgressPercentage: totalExperiments > 0 ? Math.round(((completedActivities + completedQuizzes) / (totalExperiments * 2)) * 100) : 0
        }
      }
    });
  } else {
    // Teacher & Admin Dashboard aggregations
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalExperiments = await Experiment.countDocuments();
    
    const attempts = await QuizAttempt.find();
    const avgQuizScoreGlobal = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b.score, 0) / attempts.length) : 0;

    const certificatesCountGlobal = await Certificate.countDocuments();

    const experiments = await Experiment.find({}, 'title slug');
    const experimentCompletions = await Promise.all(experiments.map(async (exp) => {
      const completedCount = await Progress.countDocuments({
        experiment: exp._id,
        activityCompleted: true,
        quizCompleted: true
      });
      return {
        slug: exp.slug,
        title: exp.title,
        completions: completedCount
      };
    }));

    // List of student progress for monitoring
    const students = await User.find({ role: 'student' }, 'name email createdAt');
    const studentList = await Promise.all(students.map(async (student) => {
      const studentProgress = await Progress.find({ user: student._id });
      const completedCount = studentProgress.filter(p => p.activityCompleted && p.quizCompleted).length;
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,
        progress: totalExperiments > 0 ? Math.round((completedCount / totalExperiments) * 100) : 0
      };
    }));

    res.status(200).json({
      status: 'success',
      data: {
        role,
        stats: {
          totalStudents,
          totalExperiments,
          avgQuizScore: avgQuizScoreGlobal,
          totalCertificates: certificatesCountGlobal,
          experimentCompletions,
          students: studentList
        }
      }
    });
  }
});

export default { getDashboardAnalytics };
