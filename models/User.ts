import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'patient' | 'researcher';
  location: {
    city: string;
    country: string;
  };
  medicalConditions?: string[];
  specialties?: string[];
  interests?: string[];
  orcidId?: string;
  acceptsMeetings?: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'researcher'],
    required: true,
  },
  location: {
    city: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  medicalConditions: {
    type: [String],
    default: [],
  },
  specialties: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },
  orcidId: {
    type: String,
    default: '',
  },
  acceptsMeetings: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
