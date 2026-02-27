import api from "../services/api.js";

export const registerUser = (data) => {
  return api.post("/users/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginUser = (data) => {
  return api.post("users/loginUser", data, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true
  });
};

export const logoutUser = () => {
  return api.post("/users/loggoutUser");
};

export const getUser = () => {
  return api.get("/users/currentUser");
};

export const fetchtAllVideo = () => {
  return api.get("/video/get");
};

export const getVideoById = (videoId) => {
  return api.get(`/video/getVideo/${videoId}`);
};

export const uploadVideo = (formData) => {
  return api.post(`/video/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

export const deleteVideo = (videoId) => {
  return api.delete(`/video/delete/${videoId}`);
};

export const getCommentsByVideo = (videoId) => {
  return api.get(`/video/comment/${videoId}`);
};

export const addComment = (videoId, comment) => {
  return api.post(
    `/video/comment/${videoId}`,
    { comment },
    { withCredentials: true },
  );
};

export const deleteComment = (commentId) => {
  return api.delete(`/video/comment/${commentId}`, { withCredentials: true });
};

export const increaseView = (videoId) => {
  return api.patch(`/video/views/${videoId}`);
};

export const likeVideo = (videoId) => api.put(`/reaction/like/${videoId}`);

export const dislikeVideo = (videoId) => {
  return api.put(`/reaction/dislike/${videoId}`, {}, { withCredentials: true });
};

export const subscribeChannel = (channelId) => {
  return api.put(`/users/subscribe/${channelId}`, { withCredentials: true });
};

export const getUserChannelProfile = (username) => {
  return api.get(`/users/c/${username}`, { withCredentials: true });
};

export const getUserChannelVideos = (username) => {
  return api.get(`/video/channelVideos/${username}`, { withCredentials: true });
};

export const updateAccountDetails = (fullName, email) => {
  return api.patch(
    "/users/updateAccountDetails",
    { fullName, email },
    { withCredentials: true },
  );
};

export const updateAvatar = (data) => {
  return api.patch("/users/updateUserAvatar", data, { withCredentials: true });
};

export const updateCoverImage = (data) => {
  return api.patch("/users/updateUserCoverImage", data, {
    withCredentials: true,
  });
};

export const subscriptionsFeed = () => {
  return api.get("/video/subscriptions");
};

export const watchHistory = () => {
  return api.get("/users/watchHistory");
};

export const searchVideos = (query) => {
  return api.get(`/video/search?query=${query}`);
};

export const changePassword = (data) => {
  return api.post("/users/changePassword", data);
};

export const likedVideos = () => {
  return api.get(`/reaction/likedVideos`);
};

export const recommendedVideos = (videoId) => {
  return api.get(`/video/recommended/${videoId}`);
};
