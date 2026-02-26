import express from "express";
import {
  commentVideo,
  deleteComment,
  getComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const CommentRouter = express.Router();

CommentRouter.post("/comment/:id", verifyJWT, commentVideo);

CommentRouter.get("/comment/:id", getComment);

CommentRouter.delete("/comment/:id", verifyJWT, deleteComment);

export default CommentRouter;
