import { Notification } from './notification.model.js';
import { AppError } from '../../utils/AppError.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getMyNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    data: { notifications }
  });
});

export const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError('Notification not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { notification }
  });
});

export default { getMyNotifications, markAsRead };
