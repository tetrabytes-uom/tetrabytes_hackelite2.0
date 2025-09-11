import { Document, Types } from 'mongoose';

export interface StudySessionType extends Document {
  planId: Types.ObjectId;
  day: number;
  date: Date;
  tasks: {
    title: string;
    resources: string;
    estimatedTime: number;
  }[];
  status: 'pending' | 'completed' | 'missed';
}
