import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      // required: true,
    },
    category: {
      type: String,
      enum: ["music", "gaming", "education", "vlog", "other"],
      default: "other",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],

    isPublished: {
      type: Boolean,
      default: true,
    },
    likesCount: { type: Number, default: 0 },

    dislikesCount: { type: Number, default: 0 },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "NewUsers",
      required: true,
    },

    shareCount: {
      type: Number,
      default: 0,
    },
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
  },
  {
    timestamps: true,
  },
);

videoSchema.index({ category: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ views: -1 });

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
