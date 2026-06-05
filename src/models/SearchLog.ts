import mongoose, { Schema, models, model } from "mongoose";

export interface ISearchLog {
  _id: mongoose.Types.ObjectId;
  query: string;
  createdAt: Date;
}

const SearchLogSchema = new Schema<ISearchLog>(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const SearchLog =
  models.SearchLog || model<ISearchLog>("SearchLog", SearchLogSchema);

export default SearchLog;
