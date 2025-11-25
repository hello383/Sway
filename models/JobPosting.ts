import mongoose, { Schema, Document } from 'mongoose'

export interface IJobPosting extends Document {
  companyName: string
  title: string
  description: string
  location: string[]
  remoteType: string
  salaryRange?: string
  postedAt: Date
  createdAt: Date
  updatedAt: Date
}

const JobPostingSchema = new Schema<IJobPosting>(
  {
    companyName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: [String],
      required: true,
    },
    remoteType: {
      type: String,
      required: true,
    },
    salaryRange: {
      type: String,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.JobPosting || mongoose.model<IJobPosting>('JobPosting', JobPostingSchema)

