import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClinicalTrial extends Document {
  externalId?: string;
  title: string;
  phase: string;
  status: string;
  condition: string;
  location: string;
  summary: string;
  description: string;
  eligibility: string;
  contactEmail: string;
  ownerResearcherId?: mongoose.Types.ObjectId;
  targetParticipants?: number;
  currentParticipants?: number;
  startDate?: Date;
  endDate?: Date;
  updatedAt: Date;
  createdAt: Date;
}

const ClinicalTrialSchema = new Schema<IClinicalTrial>({
  externalId: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  phase: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  eligibility: {
    type: String,
    default: '',
  },
  contactEmail: {
    type: String,
    default: '',
  },
  ownerResearcherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  targetParticipants: {
    type: Number,
    default: 0,
  },
  currentParticipants: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const ClinicalTrial: Model<IClinicalTrial> = 
  mongoose.models.ClinicalTrial || mongoose.model<IClinicalTrial>('ClinicalTrial', ClinicalTrialSchema);

export default ClinicalTrial;
