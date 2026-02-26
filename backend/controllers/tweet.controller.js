import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
export const createTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Please Enter the tweet ");
  }

  const tweet = await Tweet.create({ content, owner: userId });

  await tweet.populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Created Successfully "));
});

export const getUserTweets = asyncHandler(async (req, res) => {
  const { userId, tweetId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(tweetId)
  ) {
    throw new ApiError(400, "Invalid User or tweet id");
  }

  const tweet = await Tweet.findById(tweetId).populate(
    "owner",
    "username avatar",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Fetched Successfully"));
});

export const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }

  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Please write the tweet ");
  }

  const tweet = await Tweet.findByIdAndUpdate(tweetId, {
    content,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Updated Successfully"));
});

export const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Deleted Successfully "));
});
