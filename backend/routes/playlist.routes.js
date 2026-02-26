import express from "express";
import {
  addToPlaylist,
  createPlaylist,
  deletePlaylist,
  getChannelPlaylists,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";

const PlaylistRouter = express.Router();

PlaylistRouter.post("/create", verifyJWT, createPlaylist);
PlaylistRouter.post("/addVideo/:playlistId/:videoId", verifyJWT, addToPlaylist);
PlaylistRouter.put(
  "/removeVideo/:playlistId/:videoId",
  verifyJWT,
  removeVideoFromPlaylist,
);

PlaylistRouter.get("/userPlaylist/:userId", verifyJWT, getUserPlaylist);
PlaylistRouter.get("/:playlistId", optionalVerifyJWT, getPlaylistById);
PlaylistRouter.get("/channel/:username", optionalVerifyJWT, getChannelPlaylists)

PlaylistRouter.put("/update/:playlistId", verifyJWT, updatePlaylist);
PlaylistRouter.delete("/delete/:playlistId", verifyJWT, deletePlaylist);

export default PlaylistRouter;
