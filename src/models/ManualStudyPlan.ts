import mongoose, { Schema, Document } from 'mongoose';

interface Module {
  name: string;
  timeAllocation: number; // in hours
}

export interface ManualStudyPlanType extends Document {
  _id: string;
  userId: Schema.Types.ObjectId;
  subject: string;
  modules: Module[];
  totalTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<Module>({
  name: { type: String, required: true },
  timeAllocation: { type: Number, required: true, min: 0.5 },
});

const ManualStudyPlanSchema = new Schema<ManualStudyPlanType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: { type: String, required: true },
    modules: { type: [ModuleSchema], required: true, validate: {
      validator: function(modules: Module[]) {
        return modules.length > 0;
      },
      message: 'At least one module is required'
    }},
    totalTime: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ManualStudyPlan ||
  mongoose.model<ManualStudyPlanType>('ManualStudyPlan', ManualStudyPlanSchema);
