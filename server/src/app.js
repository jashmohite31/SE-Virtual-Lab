import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOptions.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/AppError.js';
import mongoose from 'mongoose';
import apiRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection readiness check for API routes
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(
      new AppError(
        'Database is not connected. Please ensure MongoDB is running locally on port 27017 or set a valid MONGODB_URI in server/.env',
        503
      )
    );
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// Serve static client assets in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Fallback for undefined routes (development)
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  });
}

// Centralized error handling
app.use(errorHandler);

export default app;
