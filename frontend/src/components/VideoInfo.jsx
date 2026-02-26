import React, { useEffect, useState } from "react";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import share from "../assets/share.png";
import save from "../assets/save.png";
import {
  dislikeVideo,
  getVideoById,
  increaseView,
  likeVideo,
} from "../utils/auth";
import "../componentSytles/PlayVideo.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import SaveToPlaylistModal from "./SaveToPlaylistModal";
import { getMyPlaylists } from "../utils/playlist";
import { useAuth } from "../utils/AuthContext";
import useRequireAuth from "../hooks/useRequireAuth";
import AuthModal from "../modal/AuthModal";
import ShareModal from "../modal/ShareModal";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

export const VideoInfo = ({ video, setVideo, videoId }) => {
  //   const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const { requireAuth, showModal, setShowModal } = useRequireAuth();

  const { user } = useAuth();
  // console.log(user);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // const handleLike = async () => {
  //   if (!requireAuth()) return;
  //   await likeVideo(videoId);
  //   const updatedVideo = await getVideoById(videoId);
  //   setVideo(updatedVideo.data.data);

  //   setLiked(true);
  //   setDisliked(false);
  // };

  const handleLike = async () => {
   
    if(!user.data || user.data===null){
      toast.info("Please login to continue")
      return;
    } 
 
   if(user.data){
    await likeVideo(videoId);
    const updatedVideo = await getVideoById(videoId);
    setVideo(updatedVideo.data.data);

    setLiked(true);
    setDisliked(false);

   }
  
  };

  const handleDislike = async () => {
    if(user.data){
      await dislikeVideo(videoId);

    const updatedVideo = await getVideoById(videoId);
    setVideo(updatedVideo.data.data);

    setDisliked(true);
    setLiked(false);
    }else {
      toast.info("Please Login to continue")
    }
    
  };

  const handleSaveClick = async () => {
    try {

      if(user.data){

        setLoadingPlaylists(true);
      const userId = user?.data?._id;
      console.log(userId);
      const res = await getMyPlaylists(userId);
      setPlaylists(res.data.data || []);
      console.log("res0", res.data.data);
      setOpenSaveModal(true);

      } else [
        toast.info("Please Login to continue")
      ]

      
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  //  useEffect(() => {
  //     if (videoId) {
  //       increaseView(videoId);
  //     }
  //   }, [videoId]);

  return (
    <>
      <div className="play-video-info">
        <p>
          {video.views} Views &bull; {dayjs(video.createdAt).fromNow()}
        </p>
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
            <img src={share} alt="share" onClick={()=> setShowShare(true)}  />
            Share
          </span>

          <span onClick={handleSaveClick}>
            <img src={save} alt="" />
            {loadingPlaylists ? "Loading..." : "Save"}
          </span>
        </div>
      </div>

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        video={video}
        videoId={videoId}
      />

      {/* Save to Playlist model :  */}
      <SaveToPlaylistModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        playlists={playlists}
        videoId={videoId}
      />

      <AuthModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
