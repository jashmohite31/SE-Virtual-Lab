import { Progress } from './progress.model.js';
import { Experiment } from '../experiments/experiment.model.js';
import { AppError } from '../../utils/AppError.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const calculateProgressPercentage = (slug, visitedTabs = [], srsDownloaded = false, activityCompleted = false, quizCompleted = false) => {
  if (slug === 'srs-generator') {
    // Theory-only subsections: visited once is enough
    const THEORY_TABS = ['aim', 'introduction', 'objective', 'theory', 'case-study'];
    const visitedTheoryCount = THEORY_TABS.filter(t => visitedTabs.includes(t)).length;
    let completedMilestones = visitedTheoryCount;

    // SRS Generator activity: must be downloaded to count
    const isDownloaded = Boolean(srsDownloaded);
    if (isDownloaded) completedMilestones += 1;

    // Quiz section: must be completed to count
    if (quizCompleted) completedMilestones += 1;

    // Total required items: 5 theory tabs + 1 download + 1 quiz = 7 items
    return Math.min(100, Math.round((completedMilestones / 7) * 100));
  }

  // Standard laboratory structure
  const BASE_THEORY_TABS = ['objective', 'theory', 'procedure'];
  const visitedBaseCount = BASE_THEORY_TABS.filter(t => visitedTabs.includes(t)).length;
  let completedMilestones = visitedBaseCount;

  if (activityCompleted) completedMilestones += 1;
  if (quizCompleted) completedMilestones += 1;

  // Total required items: 3 theory tabs + 1 activity + 1 quiz = 5 items
  return Math.min(100, Math.round((completedMilestones / 5) * 100));
};

export const getMyProgress = asyncHandler(async (req, res, next) => {
  const progressList = await Progress.find({ user: req.user.id }).populate('experiment', 'title slug');
  res.status(200).json({
    status: 'success',
    data: { progress: progressList }
  });
});

export const getExperimentProgress = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const experiment = await Experiment.findOne({ slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }

  let progress = await Progress.findOne({ user: req.user.id, experiment: experiment._id });
  if (!progress) {
    const initialTabs = slug === 'srs-generator' ? ['aim'] : ['objective'];
    const initialPct = calculateProgressPercentage(slug, initialTabs, false, false, false);
    progress = await Progress.create({
      user: req.user.id,
      experiment: experiment._id,
      visitedTabs: initialTabs,
      progressPercentage: initialPct
    });
  }

  res.status(200).json({
    status: 'success',
    data: { progress }
  });
});

export const updateExperimentProgress = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  const { visitedTab, srsDownloaded, quizCompleted, maxQuizScore, activityCompleted } = req.body;

  const experiment = await Experiment.findOne({ slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }

  let progress = await Progress.findOne({ user: req.user.id, experiment: experiment._id });
  if (!progress) {
    progress = new Progress({ user: req.user.id, experiment: experiment._id, visitedTabs: [] });
  }

  if (visitedTab && !progress.visitedTabs.includes(visitedTab)) {
    progress.visitedTabs.push(visitedTab);
  }
  if (typeof srsDownloaded === 'boolean') {
    progress.srsDownloaded = progress.srsDownloaded || srsDownloaded;
    if (srsDownloaded) {
      progress.activityCompleted = true;
    }
  }
  if (typeof activityCompleted === 'boolean') {
    progress.activityCompleted = progress.activityCompleted || activityCompleted;
  }
  if (typeof quizCompleted === 'boolean') {
    progress.quizCompleted = progress.quizCompleted || quizCompleted;
  }
  if (typeof maxQuizScore === 'number' && maxQuizScore > progress.maxQuizScore) {
    progress.maxQuizScore = maxQuizScore;
  }

  progress.progressPercentage = calculateProgressPercentage(
    slug,
    progress.visitedTabs,
    progress.srsDownloaded,
    progress.activityCompleted,
    progress.quizCompleted
  );

  await progress.save();

  res.status(200).json({
    status: 'success',
    data: { progress }
  });
});

export default { getMyProgress, getExperimentProgress, updateExperimentProgress };
