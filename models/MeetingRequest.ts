import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeetingRequest extends Document {
  fromPatientId: mongoose.Types.ObjectId;
  toResearcherId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
}

const MeetingRequestSchema = new Schema<IMeetingRequest>({
  fromPatientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toResearcherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MeetingRequest: Model<IMeetingRequest> = 
  mongoose.models.MeetingRequest || mongoose.model<IMeetingRequest>('MeetingRequest', MeetingRequestSchema);

export default MeetingRequest;
