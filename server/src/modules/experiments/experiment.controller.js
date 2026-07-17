import { Experiment } from './experiment.model.js';
import { Submission } from './submission.model.js';
import { Progress } from '../progress/progress.model.js';
import { AppError } from '../../utils/AppError.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getExperiments = asyncHandler(async (req, res, next) => {
  const experiments = await Experiment.find();
  res.status(200).json({
    status: 'success',
    results: experiments.length,
    data: { experiments }
  });
});

export const getExperimentBySlug = asyncHandler(async (req, res, next) => {
  const experiment = await Experiment.findOne({ slug: req.params.slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { experiment }
  });
});

export const getSubmission = asyncHandler(async (req, res, next) => {
  const experiment = await Experiment.findOne({ slug: req.params.slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }

  const submission = await Submission.findOne({
    user: req.user.id,
    experiment: experiment._id
  });

  res.status(200).json({
    status: 'success',
    data: { submission }
  });
});

export const saveSubmission = asyncHandler(async (req, res, next) => {
  const { data, status } = req.body;
  const experiment = await Experiment.findOne({ slug: req.params.slug });
  if (!experiment) {
    return next(new AppError('Experiment not found', 404));
  }

  let submission = await Submission.findOne({
    user: req.user.id,
    experiment: experiment._id
  });

  const isCompleted = status === 'submitted';

  if (submission) {
    submission.data = data;
    submission.status = status || submission.status;
    if (isCompleted) {
      submission.completedAt = new Date();
    }
    await submission.save();
  } else {
    const submissionData = {
      user: req.user.id,
      experiment: experiment._id,
      slug: experiment.slug,
      experimentType: experiment.slug, // Mongoose discriminator key
      data,
      status: status || 'in-progress',
      completedAt: isCompleted ? new Date() : undefined
    };
    submission = await Submission.create(submissionData);
  }

  // Update progress tracking
  await Progress.findOneAndUpdate(
    { user: req.user.id, experiment: experiment._id },
    { activityCompleted: isCompleted || (submission.status === 'submitted') },
    { upsert: true, new: true }
  );

  res.status(200).json({
    status: 'success',
    data: { submission }
  });
});
export default { getExperiments, getExperimentBySlug, getSubmission, saveSubmission };
