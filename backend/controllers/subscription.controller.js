import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  const subscriberId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  if (channelId === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  let subscribed;

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    subscribed = false;
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: subscriberId,
    });
    subscribed = true;
  }

  const subscribersCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribed,
        subscribersCount,  
      },
      subscribed
        ? "Subscribed successfully"
        : "Unsubscribed successfully"
    )
  );
});