import mongoose, { Schema } from 'mongoose';
import { StudyPlanType } from '@/types/StudyPlanType';

const StudyPlanSchema = new Schema<StudyPlanType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: { type: String, required: true },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    dailyTime: { type: Number, required: true },
    durationWeeks: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StudyPlan ||
  mongoose.model<StudyPlanType>('StudyPlan', StudyPlanSchema);
