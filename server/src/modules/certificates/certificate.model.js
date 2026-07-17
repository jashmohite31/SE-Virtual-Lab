import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  experiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Experiment', required: true },
  serialNumber: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
  metadataSnapshot: {
    studentName: { type: String, required: true },
    experimentTitle: { type: String, required: true },
    score: { type: Number, required: true }
  }
}, { timestamps: true });

export const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
