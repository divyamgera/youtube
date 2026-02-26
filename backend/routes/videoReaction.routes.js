import express from "express";
// import { Video } from '../models/Video.model';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  dislikeVideo,
  getLikedVideos,
  likeVideo,
} from "../controllers/videoReaction.controller.js";

const VideoReactionRouter = express.Router();

VideoReactionRouter.put("/like/:id", verifyJWT, likeVideo);
VideoReactionRouter.put("/dislike/:id", verifyJWT, dislikeVideo);
VideoReactionRouter.get("/likedVideos", verifyJWT, getLikedVideos);



export default VideoReactionRouter;
