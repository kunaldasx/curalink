import mongoose, { Schema, Document } from 'mongoose';

export interface IForumTopic extends Document {
  category: mongoose.Types.ObjectId;
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  authorRole: 'patient' | 'researcher';
  tags: string[];
  replyCount: number;
  viewCount: number;
  isResolved: boolean;
  isPinned: boolean;
  isHidden: boolean;
  isFlagged: boolean;
  flagReason?: string;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ForumTopicSchema = new Schema<IForumTopic>({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ForumCategory',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorRole: {
    type: String,
    enum: ['patient', 'researcher'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  replyCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
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
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for performance
ForumTopicSchema.index({ category: 1, createdAt: -1 });
ForumTopicSchema.index({ category: 1, lastActivityAt: -1 });
ForumTopicSchema.index({ authorId: 1 });
ForumTopicSchema.index({ isHidden: 1, isPinned: -1, lastActivityAt: -1 });

export default mongoose.models.ForumTopic || mongoose.model<IForumTopic>('ForumTopic', ForumTopicSchema);
