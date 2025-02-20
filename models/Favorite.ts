import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  refType: 'trial' | 'publication' | 'expert';
  refId: string;
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
    enum: ['trial', 'publication', 'expert'],
    required: true,
  },
  refId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorite: Model<IFavorite> = 
  mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
