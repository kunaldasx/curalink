import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConnection extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate connection requests
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Connection: Model<IConnection> =
  mongoose.models.Connection || mongoose.model<IConnection>('Connection', ConnectionSchema);

export default Connection;
