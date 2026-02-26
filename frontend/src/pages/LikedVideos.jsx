import React from "react";
// import VideoCard from "../components/VideoCard";
import "../pagesStyles/LikedVideos.css";
import { Sidebar } from "../components/Sidebar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { likedVideos } from "../utils/auth";
import AvatarLoader from "../components/AvatarLoader";
import { VideoCard } from "../components/VideoCard";

const LikedVideos = ({ sidebar }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const res = await likedVideos();
        setVideos(res.data.data);
      } catch (error) {
        console.log("Failed to fetch liked Videos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className={`liked-page ${sidebar ? "" : "liked-page-grow"}`}>
        <h2 className="liked-title">Liked Videos</h2>

        {loading ? (
          <AvatarLoader/>
        ) : videos?.length === 0 ? (
          <p className="empty-text">No liked videos yet ❤️</p>
        ) : (
          <div className="liked-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LikedVideos;
