import mongoose, { Document, Schema } from 'mongoose';

export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote';
export type JobStatus = 'open' | 'closed';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: JobType;
  postedBy: mongoose.Types.ObjectId;
  source: 'internal';
  status: JobStatus;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    salary: { type: String },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'remote'],
      required: [true, 'Job type is required'],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    source: {
      type: String,
      default: 'internal',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

JobSchema.index({ title: 'text', company: 'text', location: 'text', description: 'text' });

export default mongoose.model<IJob>('Job', JobSchema);
