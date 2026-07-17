import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    const errorMessages = error.errors.map((err) => `${err.path.slice(1).join('.')}: ${err.message}`).join(', ');
    next(new AppError(errorMessages, 400));
  }
};
