import express from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";
import { registerValidation } from "../validators/authValidator.js";
import { validate } from "../middlewares/validate.js";
const UserRouter = express.Router();

UserRouter.post(
  "/register",

  
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerValidation,
  validate,

  registerUser,
);


UserRouter.post(
  "/loginUser",
  loginUser,
);
UserRouter.post("/loggoutUser", verifyJWT, logoutUser);

UserRouter.post("/refresh-token", refreshAccessToken);

UserRouter.post("/changePassword", verifyJWT, changeCurrentPassword);

UserRouter.get("/currentUser",optionalVerifyJWT, getCurrentUser);
UserRouter.patch("/updateAccountDetails", verifyJWT, updateAccountDetails);

UserRouter.patch(
  "/updateUserAvatar",
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar,
);
UserRouter.patch(
  "/updateUserCoverImage",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage,
);

UserRouter.get("/c/:username", optionalVerifyJWT, getUserChannelProfile);
UserRouter.get("/watchHistory", verifyJWT, getWatchHistory);

UserRouter.put("/subscribe/:id", verifyJWT, toggleSubscription);

// UserRouter.route("/register").post(register); // Other syntax to write

export default UserRouter;
