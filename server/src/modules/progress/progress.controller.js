import { Progress } from './progress.model.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getMyProgress = asyncHandler(async (req, res, next) => {
  const progressList = await Progress.find({ user: req.user.id }).populate('experiment', 'title slug');
  res.status(200).json({
    status: 'success',
    data: { progress: progressList }
  });
});

export default { getMyProgress };
