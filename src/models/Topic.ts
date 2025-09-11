import mongoose, { Schema, Document } from 'mongoose';

interface Subtopic {
  name: string;
  learningHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: string[];
}

interface Topic extends Document {
  topic: string;
  subtopics: Subtopic[];
}

const SubtopicSchema = new Schema<Subtopic>({
  name: { type: String, required: true },
  learningHours: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  resources: { type: [String], required: true },
});

const TopicSchema = new Schema<Topic>({
  topic: { type: String, required: true, unique: true },
  subtopics: { type: [SubtopicSchema], default: [] },
});

export default mongoose.models.Topic ||
  mongoose.model<Topic>('Topic', TopicSchema);
