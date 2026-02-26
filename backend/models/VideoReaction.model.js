import mongoose, { Schema } from "mongoose";

const videoReactionSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "NewUsers",
      required: true,
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    // tweet: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Tweet",
    // },

    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

videoReactionSchema.index({ user: 1, video: 1 }, { unique: true });

export const reactionModel = mongoose.model(
  "VideoReaction",
  videoReactionSchema
);
