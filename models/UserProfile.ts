import mongoose, { Schema, Document } from 'mongoose'

export interface IUserProfile extends Document {
  fullName: string
  email: string
  phone?: string
  location: string // For backward compatibility: "Town, County" or just "County"
  county: string
  town?: string
  role: string
  experience: string
  currentCompany?: string
  expectedSalary?: string
  workHours: string
  communicationStyle: string
  remoteRetreats?: string
  workEnvironment?: string
  profileVisibility: 'visible' | 'email'
  governmentCampaign: boolean
  campaignReason?: string
  createdAt: Date
  updatedAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    county: {
      type: String,
      required: true,
    },
    town: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    currentCompany: {
      type: String,
    },
    expectedSalary: {
      type: String,
    },
    workHours: {
      type: String,
      required: true,
    },
    communicationStyle: {
      type: String,
      required: true,
    },
    remoteRetreats: {
      type: String,
    },
    workEnvironment: {
      type: String,
    },
    profileVisibility: {
      type: String,
      enum: ['visible', 'email'],
      required: true,
    },
    governmentCampaign: {
      type: Boolean,
      default: false,
    },
    campaignReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)

