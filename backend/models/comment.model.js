import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "NewUsers",
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(mongooseAggregatePaginate);

// Performance Index
commentSchema.index({ video: 1, createdAt: -1 });

export const commentModel = mongoose.model("Comment", commentSchema);
