import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin, configured origin, local development, or any render.com subdomains
    if (
      !origin || 
      origin === env.CORS_ORIGIN || 
      origin.includes('localhost') || 
      origin.includes('127.0.0.1') ||
      origin.includes('.onrender.com') ||
      env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
