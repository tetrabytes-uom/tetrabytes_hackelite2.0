import mongoose, { Schema } from 'mongoose';
import { StudySessionType } from '@/types/StudySessionType';

const StudySessionSchema = new Schema<StudySessionType>(
  {
    planId: { type: Schema.Types.ObjectId, ref: 'StudyPlan', required: true },
    day: { type: Number, required: true },
    date: { type: Date, required: true },
    tasks: [
      {
        title: { type: String, required: true },
        resources: { type: String },
        estimatedTime: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'completed', 'missed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.StudySession ||
  mongoose.model<StudySessionType>('StudySession', StudySessionSchema);
