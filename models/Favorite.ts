import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  refType: 'trial' | 'publication' | 'expert' | 'collaborator';
  refId: string;
  metadata?: any; // Store additional info for quick display
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refType: {
    type: String,
    enum: ['trial', 'publication', 'expert', 'collaborator'],
    required: true,
  },
  refId: {
    type: String,
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
FavoriteSchema.index({ userId: 1, refType: 1 });
FavoriteSchema.index({ userId: 1, refType: 1, refId: 1 }, { unique: true });

const Favorite: Model<IFavorite> = 
  mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
