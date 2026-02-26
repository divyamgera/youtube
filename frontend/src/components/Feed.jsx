import { useEffect, useState } from "react";
import "../componentSytles/Feed.css";
import { Link } from "react-router-dom";
import { fetchtAllVideo, deleteVideo } from "../utils/auth";
import AvatarLoader from "./AvatarLoader";
import { toast } from "react-toastify";
import { VideoCard } from "./VideoCard";
import { DeleteModal } from "../modal/DeleteVideoModel";
import { useAuth } from "../utils/AuthContext";

export const Feed = () => {
  const {user} = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteVideo(selectedVideo?._id);
      setVideos((prev) => prev.filter((v) => v._id !== selectedVideo._id));
      toast.success("Video deleted successfully");
      setDeleteModal(false);
      setMenuOpen(null);
      setSelectedVideo(null);
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await fetchtAllVideo();
        setVideos(res.data.data.videos || []);
      } catch (error) {
        if (error.response?.status === 401) {
          return null;
        }
        console.error("ERR WHILE LOAD ING", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  if (loading) return <AvatarLoader />;

  return (
    <>
      <div className="feed">
        {videos.length === 0 ? (
          <h2>No videos found</h2>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="yt-card">
              <Link to={`/video/getVideo/${video._id}`}>
                <div className="yt-thumbnail">
                  <img src={video.thumbnail} alt="thumb" />
                  <span className="yt-duration">
                    {formatDuration(video.duration)}
                  </span>
                </div>
              </Link>

              <div className="yt-info">
                <img
                  className="yt-avatar"
                  src={video?.owner?.avatar}
                  alt="avatar"
                />

                <div className="yt-text">
                  <h3 className="yt-title">{video.title}</h3>
                  <p className="yt-channel">{video.owner?.username}</p>
                  <p className="yt-meta">
                    {video.views || 0} views •{" "}
                    {new Date(video.createdAt).toDateString()}
                  </p>
                </div>

                {/* THREE DOTS */}
                <div
                  className="yt-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === video._id ? null : video._id);
                  }}
                >
                  ⋮
                  {menuOpen === video._id && (
                    <div
                      className="yt-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="dropdown-menu">
                        <p>▶ Play next</p>
                        <p>➕ Add to playlist</p>
                        <p>💾 Save to Watch later</p>
                        {user?.data?._id === video?.owner?._id && (
                          <p
                            onClick={() => {
                              setSelectedVideo(video);
                              setDeleteModal(true);
                              setMenuOpen(null);
                            }}
                          >
                            🗑 Delete
                          </p>
                        )}
                        <p>🚫 Not interested</p>
                        <p>📤 Share</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}

      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Video"
        description="Are you sure you want to delete this video?"
      />
    </>
  );
};
