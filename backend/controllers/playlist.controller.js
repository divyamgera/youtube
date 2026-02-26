import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { mongo } from "mongoose";
import { Video } from "../models/Video.model.js";
import userModel from "../models/User.model.js";
// import {userModel} from '../models/User.model.js';


export const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Playlist name or description is required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
    videos: [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist Created Successfully"));
});

export const addToPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { playlistId, videoId } = req.params;
  // const { videoId } = req.params.videoId;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    throw new ApiError(400, "Invalid Playlist Or Video Id");
  }

  const findPlaylist = await Playlist.findById(playlistId);
  if (!findPlaylist) {
    throw new ApiError(400, "Playlist not found");
  }

  if (findPlaylist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Invalid Accesss ");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const alreadyAdded = findPlaylist.videos.includes(videoId);
  if (alreadyAdded) {
    throw new ApiError(400, "Video Already Added to playlist");
  }

  findPlaylist.videos.push(videoId);

  await findPlaylist.save();

  // await findPlaylist.findByIdAndUpdate(playlistId, {
  //   $addToSet: { videos: videoId },
  //   new: true,
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, findPlaylist, "Video Added To Playlist "));
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { playlistId, videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    throw new ApiError(400, "Invalid Video or playlist id");
  }

  const findPlaylist = await Playlist.findById(playlistId);
  if (!findPlaylist) {
    throw new ApiError(404, "Playlist Not found");
  }

  // authorization
  if (findPlaylist.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed");
  }

  const result = await Playlist.updateOne(
    { _id: playlistId },
    {
      $pull: { videos: videoId },
    },
  );

  if (result.modifiedCount === 0) {
    throw new ApiError(400, "Video not present in playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Video Removed from playlist"));
});

export const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const playlist = await Playlist.find({
    owner: userId,
    // isPrivate: false,
  })
    .populate("owner", "username avatar")
    .populate({
      path: "videos",
      // match: { isPublished: true },
      select: "title thumbnail views duration",
    })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "User playlist fetced successfully"));
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate({
      path: "videos",
      match: { isPublished: true },
      populate: {
        path: "owner",
        select: "username avatar",
      },
    })
    .populate("owner", "username avatar");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched Successfully"));
});

export const getChannelPlaylists = asyncHandler(async(req,res)=>{
  const {username} = req.params;
 
  const user = await userModel.findOne({username});

  if(!user){
    throw new ApiError(404, "Channel not found");
  }

  const playlists = await Playlist.find({owner: user._id}).populate({
    path: "videos",
    select: "thumbnail"
  }).sort({createdAt:-1})

  return res.status(200).json(new ApiResponse(200, playlists, "Channel playlists fetched successfully"))
})

export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  await Playlist.findByIdAndDelete(playlistId );

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist Deleted Successfully"));
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }

  if (!name || !description) {
    throw new ApiError(400, "Please Provide name and description");
  }

  const updatedList = await Playlist.findByIdAndUpdate(playlistId, {
    name,
    description,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedList, "Playlist Update Successfully"));
});

