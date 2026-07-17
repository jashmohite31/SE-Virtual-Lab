import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production Mode: Send clean error details to client for operational issues
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or other unknown errors: don't leak details
      console.error('❌ UNKNOWN ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on our end.'
      });
    }
  }
};
