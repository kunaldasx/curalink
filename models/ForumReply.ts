import mongoose, { Schema, Document } from 'mongoose';

export interface IForumReply extends Document {
  topicId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  isVerified: boolean; // Researcher-provided answer
  isHidden: boolean;
  isFlagged: boolean;
  flagReason?: string;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ForumReplySchema = new Schema<IForumReply>({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'ForumTopic',
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  isVerified: {
    type: Boolean,
    default: true, // All replies from researchers are verified
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  flagReason: {
    type: String,
  },
  editedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for performance
ForumReplySchema.index({ topicId: 1, createdAt: 1 });
ForumReplySchema.index({ authorId: 1 });
ForumReplySchema.index({ isHidden: 1 });

export default mongoose.models.ForumReply || mongoose.model<IForumReply>('ForumReply', ForumReplySchema);
