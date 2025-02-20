import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPublication extends Document {
  externalId?: string;
  title: string;
  journal: string;
  authors: string[];
  doiURL: string;
  summary: string;
  createdAt: Date;
}

const PublicationSchema = new Schema<IPublication>({
  externalId: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  journal: {
    type: String,
    default: '',
  },
  authors: {
    type: [String],
    default: [],
  },
  doiURL: {
    type: String,
    default: '',
  },
  summary: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Publication: Model<IPublication> = 
  mongoose.models.Publication || mongoose.model<IPublication>('Publication', PublicationSchema);

export default Publication;
