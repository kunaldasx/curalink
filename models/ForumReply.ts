import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IForumReply extends Document {
  threadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const ForumReplySchema = new Schema<IForumReply>({
  threadId: {
    type: Schema.Types.ObjectId,
    ref: 'ForumThread',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ForumReply: Model<IForumReply> = 
  mongoose.models.ForumReply || mongoose.model<IForumReply>('ForumReply', ForumReplySchema);

export default ForumReply;
