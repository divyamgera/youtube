import { Video } from "../models/Video.model.js";
import { reactionModel } from "../models/VideoReaction.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const likeVideo = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video File Not Found");
  }

  const existingReaction = await reactionModel.findOne({
    user: userId,
    video: videoId,
  });

  // If already liked -> UNLIKE
  if (existingReaction && existingReaction.type == "like") {
    await reactionModel.deleteOne({ _id: existingReaction._id });

    await Video.findByIdAndUpdate(videoId, {
      $inc: { likesCount: -1 },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, "Like Removed"));
  }

  // If disliked earlier -> remove dislike first
  if (existingReaction && existingReaction.type === "dislike") {
    await reactionModel.findByIdAndUpdate(existingReaction._id, {
      type: "like",
    });
    await Video.findByIdAndUpdate(videoId, {
      $inc: { likesCount: 1, dislikesCount: -1 },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: true }, "Dislike removed & liked"));
  }

  await reactionModel.create({
    user: userId,
    video: videoId,
    type: "like",
  });

  await Video.findByIdAndUpdate(videoId, {
    $inc: { likesCount: 1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { liked: true }, "Video liked successfully"));
});

export const dislikeVideo = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;

  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video File Not Found");
  }

  const existingReaction = await reactionModel.findOne({
    user: userId,
    video: videoId,
  });

  // If already disliked -> remove DisLIKE
  if (existingReaction && existingReaction.type === "dislike") {
    await reactionModel.deleteOne({ _id: existingReaction._id });

    await Video.findByIdAndUpdate(videoId, {
      $inc: { dislikesCount: -1 },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { disliked: false }, "DisLike Removed"));
  }

  // If Previously Liked -> switch to dislike
  if (existingReaction && existingReaction.type === "like") {
    await reactionModel.findByIdAndUpdate(existingReaction._id, {
      type: "dislike",
    });

    await Video.findByIdAndUpdate(videoId, {
      $inc: { likesCount: -1, dislikesCount: 1 },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, { disliked: true }, "like removed & disliked"),
      );
  }

  // Fresh Disklike

  await reactionModel.create({
    user: userId,
    video: videoId,
    type: "dislike",
  });

  await Video.findByIdAndUpdate(videoId, {
    $inc: { dislikesCount: 1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { disliked: true }, "Video disliked"));
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await reactionModel
    .find({
      user: userId,
      type: "like",
    })
    .populate({
      path: "video",
      populate: {
        path: "owner",
        select: "username avatar",
      },
    })
    .sort({ createdAt: -1 });

  const videos = likedVideos
    .filter((r) => r.video !== null)
    .map((r) => r.video);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});
