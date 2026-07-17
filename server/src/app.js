import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOptions.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/AppError.js';
import apiRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
