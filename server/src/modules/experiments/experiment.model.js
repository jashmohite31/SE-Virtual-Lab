import mongoose from 'mongoose';

const experimentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  objective: { type: String, required: true },
  theory: { type: String, required: true },
  procedure: { type: String, required: true },
  estimatedDuration: { type: Number, default: 30 }
}, { timestamps: true });

export const Experiment = mongoose.model('Experiment', experimentSchema);
export default Experiment;
