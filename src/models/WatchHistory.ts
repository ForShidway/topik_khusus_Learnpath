import mongoose, { Schema, models, model } from "mongoose";

export interface IWatchHistory {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  topic: string;
  videoTitle: string;
  videoUrl: string;
  thumbnail: string;
  savedAt: Date;
}

const WatchHistorySchema = new Schema<IWatchHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    videoTitle: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const WatchHistory =
  models.WatchHistory ||
  model<IWatchHistory>("WatchHistory", WatchHistorySchema);

export default WatchHistory;
