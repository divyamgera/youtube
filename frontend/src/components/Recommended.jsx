import React, { useEffect, useState } from "react";

import "../componentSytles/Recommended.css";

import { useParams } from "react-router-dom";
import { recommendedVideos } from "../utils/auth";
import AvatarLoader from "./AvatarLoader";
import { VideoCard } from "./VideoCard";
// import VideoCard from "./VideoCard";

export const Recommended = () => {
  const { videoId } = useParams();
  const [recommended, setRecommended] = useState([]);
  const [loadingRec, setLoadingRec] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoadingRec(true);
        const res = await recommendedVideos(videoId);
        // console.log("RECOMEND RES: ",res.data)
        setRecommended(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingRec(false);
      }
    };

    fetchRecommended();
  }, [videoId]);

  return (
    <>
      <div className="recommended">
        {loadingRec ? (
          <AvatarLoader />
        ) : (
          recommended.map((video) => (
            <VideoCard  key={video._id} video={video} variant="grid" />
            // <div className="side-video-list">
            //   <img src={video.thumbnail} alt="" />
            //   <div className="vid-info">
            //     <h4>{video.title}</h4>
            //     <p>@{video.owner.username}</p>
            //     <p>{video.views} views</p>
            //   </div>
            // </div>
          ))
        )}
      </div>
    </>
  );
};
