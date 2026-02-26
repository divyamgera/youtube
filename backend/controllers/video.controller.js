import mongoose from "mongoose";
import { Video } from "../models/Video.model.js";
// import {userModel} from '../models/User.model.js'
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscription } from "../models/subscription.model.js";
import userModel from "../models/User.model.js";

export const increaseShareCount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  video.shareCount += 1;
  await video.save();

  return res.status(200).json({
    success: true,
    message: "Share count updated",
    shareCount: video.shareCount,
  });
});

export const createVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, category , tags} = req.body; // videoFile, thumbnail, views, isPubished, owner

    const videoFilePath = req.files?.videoFile?.[0]?.path;
   
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    const videoFile = await uploadOnCloudinary(videoFilePath);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);


    if (!videoFile) {
      throw new ApiError(400, "VideoFile is required");
    }


      // ✅ TAGS HANDLE
    let parsedTags = [];

    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags;
      } else if (typeof tags === "string") {
        parsedTags = tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag !== "");
      }
    }

    // ✅ Remove duplicates
    parsedTags = [...new Set(parsedTags)];

    // ✅ Limit tags
    if (parsedTags.length > 10) {
      throw new ApiError(400, "Maximum 10 tags allowed");
    }

    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail?.url || "",
      title,
      description,
      category,
      tags: parsedTags,
      duration: Math.floor(videoFile.duration),
      owner: req.user._id,
    });


    if (!video) {
      throw new ApiError(400, "Error in video creation");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video Created Successfully"));
  } catch (error) {
    throw new ApiError(400, error.message || "ERROR WHILE CREATING VIDEO");
  }
});

export const getVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username avatar watchHistory",
  );
  // console.log(video);
  if (!video) {
    throw new ApiError(400, "Video File Not Found");
  }

  // watch history logic

  // console.log(":UserID:", userId);

  if (req.user) {
    const historyRes = await userModel.findByIdAndUpdate(req.user._id, {
      $push: {
        watchHistory: {
          $each: [
            {
              video: video._id,
              watchedAt: new Date(),
            },
          ],

          $position: 0, // latest on top
        },
      },
    });
  }

  // console.log(historyRes.watchHistory)

  // console.log(historyRes)

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Fetched Successfully "));
});

export const getAllVideos = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; // apne app skip krta hai kya koi functon ha i kay

  const { search, category } = req.query;

  let filter = {
    isPublished: true,
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  // console.log("FILTER =>", filter);

  if (category) {
    filter.category = category;
  }

  const videos = await Video.find(filter)
    .populate("owner", "username avatar")
    .sort({ createAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalVideos = await Video.countDocuments(filter);
  // console.log("TOTAL VIDEOS =>", totalVideos);

  return res.status(200).json(
    new ApiResponse(200, {
      page,
      limit,
      totalVideos,
      totalPages: Math.ceil(totalVideos / limit),
      videos,
    }),
    "Videos fetched Successfully",
  );
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const userId  = req.user._id;
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  const video = await Video.findById(videoId);
  if(!video){
    throw new ApiError(404, "Video not found");
  }

  if(video.owner.toString() !== userId.toString() ){
    throw new ApiError(403, "You are not allowed to delete this video")
  } 

  await Video.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, "Video Deleted Successfully"));
});


export const increaseViewCount = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true },
  );
  // console.log(video);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video.views, "View count updated"));
});

export const likeVideo = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid Video Id");
  }
  // console.log(videoId);
  const existingLike = await Video.findOne({
    user: req.user._id,
    video: videoId,
  });

  // console.log(existingLike);
  if (existingLike) {
    await Video.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { like: false }, "Unike Successfully"));
  }

  await Video.create({
    user: req.user._id,
    video: videoId,
    owner: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, { like: true }, "Like Successfully"));
});

export const getSubscriptionsFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // find all subscriptions of user
  const subscriptions = await Subscription.find({
    subscriber: userId,
  }).select("channel");

  // console.log("SUBSCRIPTION = ", subscriptions);

  // if user has no subscriptions

  if (!subscriptions.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No Subscribed channels yet"));
  }

  // extract channel IDs

  const channelIds = subscriptions.map((sub) => sub.channel);
  // console.log("CHNAL ID: ", channelIds);
  // Fetch videos from subscribed channels

  const videos = await Video.find({
    owner: { $in: channelIds },
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "username avatar");

  // console.log("VIdoes: ", videos);
  // count total videos (for pagination info)
  const totalVideos = await Video.countDocuments({
    owner: { $in: channelIds },
    isPublished: true,
  });

  // console.log(totalVideos);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { page, limit, totalVideos, videos },
        "Subscriptions feed fetched successfully",
      ),
    );
});

export const getUserChannelVideos = asyncHandler(async (req, res) => {
  const { username } = req.params;
  // console.log(username)
  const user = await userModel.findOne({ username });
  // console.log("USER", user)

  if (!user) {
    throw new ApiError(404, "Channel not found");
  }

  const channelVideos = await Video.find({ owner: user?._id }).sort({
    createdAt: -1,
  });

  if (!channelVideos) {
    throw new ApiError(500, "Error while fetching channel videos");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelVideos, "Channel Video Fetched Successfully"),
    );
});

// export const searchVideos = asyncHandler(async (req, res) => {
//   const { query } = req.query;
//   if (!query || query.trim() === "") {
//     return res.status(200).json(new ApiResponse(200, [], "Empty Search"));
//   }

//   const videos = await Video.find({
//     isPublished: true,
//     $or: [
//       { title: { $regex: query, $options: "i" } },
//       { description: { $regex: query, $options: "i" } },
//       { username: { $regex: query, $options: "i" } },
//     ],
//   })
//     .populate("owner", "username avatar")
//     .sort({ createdAt: -1 })
//     .limit(20);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, videos, "Search results fetched"));
// });


export const searchVideos = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim();
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, [], "Search query required"));
  }

  // Escape special regex characters (Security fix)
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const searchFilter = {
    isPublished: true,
    $or: [
      { title: { $regex: escapedQuery, $options: "i" } },
      { description: { $regex: escapedQuery, $options: "i" } },
      {username :{$regex: escapedQuery, $options: "i"}},
    ],
  };

  const [videos, total] = await Promise.all([
    Video.find(searchFilter)
      .populate("owner", "username avatar")
      .sort({ views: -1 }) // Better ranking
      .skip(skip)
      .limit(limit),

    Video.countDocuments(searchFilter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      results: videos,
    }, "Search results fetched")
  );
});
export const getRecommendedVideos = async (req, res) => {
  try {
    const { videoId } = req.params;
    const currentVideo = await Video.findById(videoId);
    console.log("CURENT VID", currentVideo);
    if (!currentVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    const recommended = await Video.aggregate([
      {
        $match: {
          _id: { $ne: currentVideo._id },
          isPublished: true,
        },
      },

      {
        $addFields: {
          categoryMatch: {
            $cond: [{ $eq: ["$category", currentVideo.category] }, 5, 0],
          },
          tagMatch: {
            $size: {
              $setIntersection: ["$tags", currentVideo.tags || []],
            },
          },
        },
      },

      {
        $addFields: {
          score: {
            $add: [
              "$categoryMatch",
              "$tagMatch",
              { $divide: ["$views", 1000] },
            ],
          },
        },
      },

      { $sort: { score: -1, createdAt: -1 } },
      { $limit: 12 },
      {
        $lookup: {
          from: "newusers",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },

      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.status(200).json(recommended);
  } catch (error) {
    console.error("RECOMMEND ERROR:", error); // 🔥 print real error
    throw new ApiError(500, "Server Error");
  }
};
