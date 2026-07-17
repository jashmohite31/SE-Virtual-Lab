import { Certificate } from './certificate.model.js';
import { AppError } from '../../utils/AppError.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getMyCertificates = asyncHandler(async (req, res, next) => {
  const certificates = await Certificate.find({ user: req.user.id }).populate('experiment', 'title slug');
  res.status(200).json({
    status: 'success',
    data: { certificates }
  });
});

export const getCertificateBySerial = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findOne({ serialNumber: req.params.serial }).populate('experiment', 'title slug');
  if (!certificate) {
    return next(new AppError('Certificate not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { certificate }
  });
});

export default { getMyCertificates, getCertificateBySerial };
