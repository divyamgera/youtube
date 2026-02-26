import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Video } from "../models/Video.model.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const commentVideo = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;

  const userId = req.user._id;

  const { comment } = req.body;
  // console.log(comment);

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  if (!comment || !comment.trim()) {
    throw new ApiError(400, "Please write the comment");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video File Not Found");
  }

  const createComment = await commentModel.create({
    comment,
    video: videoId,
    owner: userId,
  });

  // console.log(createComment);

  if (!createComment) {
    throw new ApiError(500, "Error while creating comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createComment, "Comment added Successfully"));
});

export const getComment = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video Not Found");
  }

  // Fetch comments of this video

  const comments = await commentModel
    .find({
      video: videoId,
      isDeleted: false,
    })
    .populate("owner", "fullName avatar")
    .sort({ createdAt: -1 });

  // if (comments.length === 0) {
  //   throw new ApiError(404, "No comments found for this video ");
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        comments.length,
        comments,
        "Comment fetched Successfully"
      )
    );
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;

  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await commentModel.findOne({
    _id: commentId,
    isDeleted: false,
  });
  // console.log(comment);
  if (!comment) {
    throw new ApiError(404, "Comment does not found");
  }

  // find video of the comment

  const video = await Video.findById(comment.video);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // /authorization check

  const isCommentOwner = comment.owner.toString() === userId.toString();

  const isVideoOwner = video.owner.toString() === userId.toString();

  if (!isCommentOwner && !isVideoOwner) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  // soft delete

  comment.isDeleted = true;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment Deleted Successfully"));
});
