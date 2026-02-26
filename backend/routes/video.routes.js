import express from "express";
import {
  optionalVerifyJWT,
  verifyJWT,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getRecommendedVideos,
  getSubscriptionsFeed,
  getUserChannelVideos,
  getVideo,
  increaseShareCount,
  increaseViewCount,
  likeVideo,
  searchVideos,
} from "../controllers/video.controller.js";

const VideoRouter = express.Router();

VideoRouter.post(
  "/upload",
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createVideo,
);

VideoRouter.get("/getVideo/:videoId", optionalVerifyJWT, getVideo);
VideoRouter.get("/get", getAllVideos);

VideoRouter.patch("/views/:id", increaseViewCount);
VideoRouter.delete("/delete/:videoId", verifyJWT, deleteVideo);

VideoRouter.get("/subscriptions", verifyJWT, getSubscriptionsFeed);

VideoRouter.get("/channelVideos/:username", optionalVerifyJWT, getUserChannelVideos);

VideoRouter.get("/search", searchVideos);
VideoRouter.get("/recommended/:videoId", getRecommendedVideos);
// VideoRouter.put("/like/:id", verifyJWT, likeVideo);

VideoRouter.post("/share/:id", increaseShareCount)

export default VideoRouter;
