import express from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const TweetRouter = express.Router();

TweetRouter.post("/create", verifyJWT, createTweet);
TweetRouter.get("/getUserTweet/:userId/:tweetId", verifyJWT, getUserTweets);
TweetRouter.put("/updateTweet/:tweetId", verifyJWT, updateTweet);
TweetRouter.delete("/deleteTweet/:tweetId", verifyJWT, deleteTweet);

export default TweetRouter;
