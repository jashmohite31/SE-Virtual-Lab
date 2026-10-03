import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Resolve SRV records reliably on Windows/Node when using mongodb+srv://
if (env.MONGODB_URI.startsWith('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    // Fall back to default system DNS if setServers is restricted
  }
}

export const connectDB = async () => {
  try {
    console.log(`⏳ Connecting to MongoDB at ${env.MONGODB_URI}...`);
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Database connection warning: ${error.message}`);
    console.warn(`👉 Ensure MongoDB is running locally on port 27017 or set MONGODB_URI in server/.env`);
    return false;
  }
};
