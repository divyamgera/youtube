// import { Link } from "react-router-dom";
// import "../componentSytles/VideoCard.css";
// const VideoCard = ({ video }) => {
//   const formatDuration = (seconds = 0) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };
//   return (
//     <Link to={`/video/getVideo/${video._id}`} className="video-cards">
//       <div className="thumbnail-box">
//         <img src={video.thumbnail} alt={video.title} className="thumbnail" />
//         <span className="duration"> {formatDuration(video.duration)}</span>
//       </div>
//       <div className="video-info">
//         <img src={video.owner?.avatar} alt="channel" className="avatar" />
//         <div className="text">
//           <h4 className="title">{video.title}</h4>
//           <p className="channel">{video.owner?.username}</p>
//           <p className="meta">
//             {video.views} views • {video.createdAt?.slice(0, 10)}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// };
// export default VideoCard;


import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../componentSytles/VideoCard.css";

export const VideoCard = ({ video, variant = "grid" }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

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
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`video-card ${variant}`}>

      {/* Thumbnail */}
      <Link to={`/video/getVideo/${video?._id}`} className="thumb-wrapper">
        <img src={video?.thumbnail} alt={video?.title} />
        <div className="overlay"></div>
        <span className="duration">
          {formatDuration(video?.duration)}
        </span>
      </Link>

      {/* Info */}
      <div className="video-info">

        {variant !== "compact" && (
          <img
            src={video?.owner?.avatar}
            alt=""
            className="channel-avatar"
          />
        )}

        <div className="text-content">
          <h4 className="title">{video?.title}</h4>

          <p className="channel-name">
            {video?.owner?.username}
          </p>

          <p className="meta">
            {video?.views} views • {timeAgo(video?.createdAt)}
          </p>
        </div>

        <div className="menu-container" ref={menuRef}>
          <div
            className="three-dots"
            onClick={() => setOpenMenu(!openMenu)}
          >
            ⋮
          </div>

          {openMenu && (
            <div className="dropdown-menu">
              <p>▶ Play next</p>
              <p>➕ Add to playlist</p>
              <p>💾 Save to Watch later</p>
                <p> Delete </p>
              <p>🚫 Not interested</p>
              <p>📤 Share</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
