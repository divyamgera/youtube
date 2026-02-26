import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../utils/playlist";
import { Sidebar } from "../components/Sidebar";
import dayjs from "dayjs";
import "../pagesStyles/PlaylistDetail.css";

const PlaylistDetail = ({ sidebar }) => {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleRemove = async (videoId) => {
    try {
      await removeVideoFromPlaylist(playlist._id, videoId);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        name,
        description,
      };
      const res = await updatePlaylist(playlist._id, data);
      setPlaylist(res.data.data);
      setOpenEdit(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const res = await getPlaylistById(playlistId);
        setPlaylist(res.data.data);
        setName(res.data.data.name);
        setDescription(res.data.data.description);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [playlistId]);

  if (loading) return <p className="loading-text">Loading playlist...</p>;
  if (!playlist) return <p>Playlist not found</p>;

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div
        className={`playlist-detail ${sidebar ? "" : "playlist-detail-grow"}`}
      >
        {/* HEADER */}
        <div className="playlist-header">
          <div className="playlist-thumb">
            {playlist.videos.length > 0 ? (
              <img src={playlist.videos[0].thumbnail} alt="" />
            ) : (
              <div className="empty-thumb">No Videos</div>
            )}
          </div>

          <div className="playlist-meta">
            <h2>{playlist.name}</h2>
            <p>{playlist.description}</p>
            <span>
              {playlist.videos.length} videos • by {playlist.owner.username}
            </span>
          </div>

          {/* 🔥 THREE DOTS */}
          <div className="playlist-menu-wrapper">
            <button
              className="playlist-menu-btn"
              onClick={() => setOpenMenu(!openMenu)}
            >
              ⋮
            </button>

            {openMenu && (
              <div className="playlist-menu-dropdown">
                <div
                  className="playlist-menu-item"
                  onClick={() => {
                    setOpenEdit(true);
                    setOpenMenu(false);
                  }}
                >
                  ✏️ Edit playlist
                </div>
              </div>
            )}
          </div>
        </div>

        {/* VIDEOS */}
        <div className="playlist-videos">
          {playlist.videos.map((video, index) => (
            <div key={video._id} className="playlist-video">
              <span className="index">{index + 1}</span>

              <Link to={`/video/getVideo/${video._id}`}>
                <div>
                  <img src={video.thumbnail} alt="" />
                  <div className="vid-info">
                    <h4>{video.title}</h4>
                    <p>
                      {video?.owner?.username} • {video.views} views •{" "}
                      {dayjs(video.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </Link>

              <button
                className="remove-btn"
                onClick={() => handleRemove(video._id)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 EDIT MODAL */}
      {openEdit && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit playlist</h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist name"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <div className="modal-actions">
              <button onClick={() => setOpenEdit(false)}>Cancel</button>
              <button onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistDetail;
