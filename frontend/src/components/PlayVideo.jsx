import { useEffect, useState } from "react";
import "../componentSytles/PlayVideo.css";

import {  useParams } from "react-router-dom";
import {
  getUserChannelProfile,
  getVideoById,
  increaseView,
} from "../utils/auth";
import { CommentSection } from "./CommentSection";

import { PublisherSection } from "./PublisherSection";
import { VideoInfo } from "./VideoInfo";
import AvatarLoader from "./AvatarLoader";

export const PlayVideo = () => {
  // const { user: currentUser } = useAuth();
  // console.log("PLAY VIDEO COMPO RENDERED");
  const { videoId } = useParams();


  const [channel, setChannel] = useState(null);

  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(true);

  // const handleLike = async () => {
  //   await likeVideo(videoId);

  //   const updatedVideo = await getVideoById(videoId);
  //   setVideo(updatedVideo.data.data);

  //   setLiked(true);
  //   setDisliked(false);
  // };



  // const handleDislike = async () => {
  //   await dislikeVideo(videoId);

  //   const updatedVideo = await getVideoById(videoId);
  //   setVideo(updatedVideo.data.data);

  //   setDisliked(true);
  //   setLiked(false);
  // };


  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true)
        const videoRes = await getVideoById(videoId);
        const videoData = videoRes.data.data;
        // console.log("Play video rsponse",videoData)
        setVideo(videoData);
        // console.log(videoRes.data);

        // CHANNEL PROFILE FETCH

        const channelRes = await getUserChannelProfile(
          videoData?.owner?.username,
        );
        
        setChannel(channelRes.data.data);
        // setSubscribed(channelRes.data.data.isSubscribed);
        // setSubscribersCount(channelRes.data.data.subscribersCount);
        // console.log("channel res",channelRes);
      } catch (error) {
        console.error("Error loading video", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      increaseView(videoId);
    }
  }, [videoId]);

  if (loading) return <AvatarLoader/>
  if (!video) return <h2> Video not found </h2>;

  return (
    <>
      <div className="play-video">
        <video className="video-stream" src={video.videoFile} controls autoPlay muted></video>

        <h3>{video.title}</h3>
        {/* <h4>{video.description}</h4> */}

        <VideoInfo video={video} videoId={videoId} setVideo={setVideo} />

        {/* <div className="play-video-info">
          <p>{video.views} Views &bull; 2 days ago</p>
          <div>
            <span onClick={handleLike}>
              <img src={like} alt="" className={liked ? "active" : ""} />
              {video.likesCount}
            </span>
            <span onClick={handleDislike}>
              <img src={dislike} alt="" className={disliked ? "active" : ""} />
              {video.dislikesCount}
            </span>
            <span>
              <img src={share} alt="" />
              Share
            </span>
            <span>
              <img src={save} alt="" />
              Save
            </span>
          </div>
        </div> */}

        <hr />

        <PublisherSection video={video} channel={channel} />

        <div className="vid-description">
          <p>{video.description}</p>
         
          <hr />

          <CommentSection videoId={videoId} />
        </div>
      </div>
    </>
  );
};
