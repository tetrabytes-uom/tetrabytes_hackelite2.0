import { Document, Types } from 'mongoose';

export interface StudyPlanType extends Document {
  _id: string;
  userId: Types.ObjectId;
  topic: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyTime: number; // hours per day
  durationWeeks: number;
  createdAt: Date;
  status: 'active' | 'completed' | 'paused';
}
