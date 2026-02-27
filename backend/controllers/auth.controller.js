import userModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import jwt, { decode } from "jsonwebtoken";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    // console.log("UZERSSD: ", user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log(accessToken);

    // console.log("REF =", refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Soemthing went wrong while generating refresh and access token",
    );
  }
};


export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty,etc
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  // console.log(req.body);
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fileds are required");
  }

  const existedUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  console.log("EXisted User :", existedUser);
  if (existedUser) {
    throw new ApiError(400, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log(req.files);
  // console.log("avattttaarr file : ", avatarLocalPath);
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // console.log(coverImageLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await userModel.create({
    fullName,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully "));
});

export const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }
  // console.log("USER:", user);
  const isPasswordValid = await user.isPasswordCorrect(password);
  // console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  // console.log(accessToken);
  // console.log("REFERSH TOKEN :: " + refreshToken);

  const loggedInUser = await userModel
    .findById(user._id)
    .select(" -password -refreshToken ");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged in Successfully",
      ),
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    // console.log("iNCOiming Refersh toekn", incomingRefreshToken);

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // console.log("Decoded Token : " + decodedToken);

    const user = await userModel.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token ");
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is Expired or used");
    }

    // console.log("CHECKING HEEERE", user?.refreshToken);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    // console.log(accessToken);
    // console.log("NEW REFRESH TOKONN: " + refreshToken);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token Refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "invalid refresh token");
  }
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // console.log(req.body);

  const user = await userModel.findById(req.user?._id);
  // console.log(user);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  // console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user Fetched Successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await userModel
    .findByIdAndUpdate(
      req.user?._id,
      {
        $set: { fullName, email },
      },
      {
        new: true,
      },
    )
    .select("-password");
  // console.log("RQUET USER", req.user);
  // console.log(user);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully "));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // console.log(avatarLocalPath);
  // console.log("REQ filE PATH: ", req.file?.path);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading the avatar");
  }

  const user = await userModel
    .findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      {
        new: true,
      },
    )
    .select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading the coverImage");
  }

  const user = await userModel
    .findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          coverImage: coverImage.url,
        },
      },
      {
        new: true,
      },
    )
    .select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage updated successfully"));
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await userModel.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },

        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  // console.log("CHanel 1: ", channel[0]);
  // console.log("CHanel 2: ", channel[1]);
  // console.log("CHanel 3: ", channel[2]);
  // console.log(channel?.length);
  // console.log("LOOKUP", $lookup);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched Successfully"),
    );
});



// export const getWatchHistory = asyncHandler(async (req, res) => {
//   const user = await userModel.aggregate([
//     {
//       $match: {
//         _id: new mongoose.Types.ObjectId(req.user._id),
//       },
//     },
//     {
//       $lookup: {
//         from: "videos",
//         localField: "watchHistory",
//         foreignField: "_id",        
//         as: "watchHistory",
//         pipeline: [
//           {
//             $lookup: {
//               from: "newusers",
//               localField: "owner",
//               foreignField: "_id",
//               as: "owner",
//               pipeline: [
//                 {
//                   $project: {
//                     fullName: 1,
//                     username: 1,
//                     avatar: 1,
//                   },
//                 },
//               ],
//             },
//           },

//           {
//             $addFields: {
//               owner: {
//                 $first: "$owner",
//               },
//             },
//           },
//         ],
//       },
//     },
//   ]);

//   console.log("User History",user);

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         user[0].watchHistory,
//         "Watch History fetched Successfully",
//       ),
//     );
// });


export const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await userModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },

    // 1️⃣ unwind history
    {
      $unwind: "$watchHistory",
    },

    // 2️⃣ lookup video
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory.video",
        foreignField: "_id",
        as: "video",
      },
    },

    {
      $unwind: "$video",
    },

    // 3️⃣ lookup owner
    {
      $lookup: {
        from: "newusers",
        localField: "video.owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },

    {
      $addFields: {
        "video.owner": { $first: "$owner" },
      },
    },

    // 4️⃣ final shape
    {
      $project: {
        _id: 0,
        watchedAt: "$watchHistory.watchedAt",
        video: "$video",
      },
    },

    // 5️⃣ latest first (YT style)
    {
      $sort: { watchedAt: -1 },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Watch History fetched Successfully"
    )
  );
});
