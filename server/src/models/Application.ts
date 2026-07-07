import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
export type JobSource = 'internal' | 'linkedin' | 'naukri' | 'internshala' | 'unstop';

export interface IExternalJobData {
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  source: JobSource;
  description?: string;
  salary?: string;
}

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  jobSource: JobSource;
  externalJobData?: IExternalJobData;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExternalJobDataSchema = new Schema<IExternalJobData>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    applyUrl: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String },
    salary: { type: String },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    jobSource: {
      type: String,
      enum: ['internal', 'linkedin', 'naukri', 'internshala', 'unstop'],
      required: true,
    },
    externalJobData: { type: ExternalJobDataSchema },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
