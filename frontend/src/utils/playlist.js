import api from "../services/api";

export const createPlaylist = (data) => {
  return api.post("/playlist/create/", data, {
    withCredentials: true,
  });
};

export const addVideoToPlaylist = (playlistId, videoId) => {
  return api.post(`/playlist/addVideo/${playlistId}/${videoId}`, null, {
    withCredentials: true,
  });
};

export const getMyPlaylists = (userId) => {
  return api.get(`/playlist/userPlaylist/${userId}`, {
    withCredentials: true,
  });
};

export const getPlaylistById = (playlistId) => {
  return api.get(`/playlist/${playlistId}`, {
    withCredentials: true,
  });
};

export const getChannelPlaylists = (username) => {
  return api.get(`/playlist/channel/${username}`);
}

export const removeVideoFromPlaylist = (playlistId, videoId) => {
  return api.put(`/playlist/removeVideo/${playlistId}/${videoId}`, {
    withCredentials: true,
  });
};

export const updatePlaylist = (playlistId, data) => {
  return api.put(`/playlist/update/${playlistId}`, data, {
    withCredentials: true,
  });
};

export const deletePlaylist = (playlistId) => {
  return api.delete(`/playlist/delete/${playlistId}`);
}