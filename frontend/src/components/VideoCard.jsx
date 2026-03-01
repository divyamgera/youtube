import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../componentSytles/VideoCard.css";
import { DeleteModal } from "../modal/DeleteVideoModel";
import { deleteVideo } from "../utils/auth";
import { toast } from "react-toastify";
import { useAuth } from "../utils/AuthContext";

export const VideoCard = ({ video, variant = "grid" }) => {
  const {user} = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
   const [deleting, setDeleting] = useState(false);
  const menuRef = useRef();

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

  const formatDuration = (sec) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / (1000 * 60 * 60 * 24));
    if (diff < 1) return "Today";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
    
    <div className={`video-card ${variant}`}>
      {/* Thumbnail */}
      <Link to={`/video/getVideo/${video?._id}`} className="thumb-wrapper">
        <img src={video?.thumbnail} alt={video?.title} />
        <div className="overlay"></div>
        <span className="duration">{formatDuration(video?.duration)}</span>
      </Link>

      {/* Info */}
      <div className="video-info">
        {variant !== "compact" && (
          <img src={video?.owner?.avatar} alt="D" className="channel-avatar" />
        )}

        <div className="text-content">
          <h4 className="title">{video?.title}</h4>

          <p className="channel-name">{video?.owner?.username}</p>

          <p className="meta">
            {video?.views} views • {timeAgo(video?.createdAt)}
          </p>
        </div>

        <div className="menu-container" ref={menuRef}>
          <div className="three-dots" onClick={() => setMenuOpen(!menuOpen)}>
            ⋮
          </div>

          {menuOpen && (
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
          )}
        </div>
      </div>
    </div>

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
