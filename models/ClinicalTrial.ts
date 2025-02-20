import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClinicalTrial extends Document {
  externalId?: string;
  title: string;
  phase: string;
  status: string;
  condition: string;
  location: string;
  summary: string;
  contactEmail: string;
  ownerResearcherId?: mongoose.Types.ObjectId;
  updatedAt: Date;
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
  contactEmail: {
    type: String,
    default: '',
  },
  ownerResearcherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClinicalTrial: Model<IClinicalTrial> = 
  mongoose.models.ClinicalTrial || mongoose.model<IClinicalTrial>('ClinicalTrial', ClinicalTrialSchema);

export default ClinicalTrial;
