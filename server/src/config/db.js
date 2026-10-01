import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Database connection warning: ${error.message}`);
    console.warn(`👉 Ensure MongoDB is running locally on port 27017 or set MONGODB_URI in server/.env`);
    return false;
  }
};
