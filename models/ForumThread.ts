import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IForumThread extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
}

const ForumThreadSchema = new Schema<IForumThread>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ForumThread: Model<IForumThread> = 
  mongoose.models.ForumThread || mongoose.model<IForumThread>('ForumThread', ForumThreadSchema);

export default ForumThread;
