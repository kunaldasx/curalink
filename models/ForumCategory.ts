import mongoose, { Schema, Document } from 'mongoose';

export interface IForumCategory extends Document {
  name: string;
  description: string;
  slug: string;
  createdBy: mongoose.Types.ObjectId;
  moderators: mongoose.Types.ObjectId[];
  topicCount: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ForumCategorySchema = new Schema<IForumCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  moderators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  topicCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Index for better query performance
ForumCategorySchema.index({ slug: 1 });
ForumCategorySchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.models.ForumCategory || mongoose.model<IForumCategory>('ForumCategory', ForumCategorySchema);
