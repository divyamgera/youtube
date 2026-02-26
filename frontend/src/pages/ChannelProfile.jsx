import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getUserChannelProfile,
  getUserChannelVideos,
  subscribeChannel,
} from "../utils/auth";
import "../pagesStyles/ChannelProfile.css";
import { Sidebar } from "../components/Sidebar";
import { getChannelPlaylists, getMyPlaylists } from "../utils/playlist";
import { useAuth } from "../utils/AuthContext";

const ChannelProfile = ({ sidebar }) => {
  const { username } = useParams();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [activeTab, setActiveTab] = useState("videos");

  const [playlists, setPlaylists] = useState([]);

  const formatDuration = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const loadChannel = async () => {
      const res = await getUserChannelProfile(username);
      setChannel(res.data.data);
      setSubscribed(res.data.data.isSubscribed);
      setSubCount(res.data.data.subscribersCount);

      const videoRes = await getUserChannelVideos(username);
      // console.log("Videos Response",videoRes)
      setVideos(videoRes.data.data);

      const playlistRes = await getChannelPlaylists(username);
      setPlaylists(playlistRes.data.data);
    };

    loadChannel();
  }, [username]);

  const handleSubscribe = async () => {
    const res = await subscribeChannel(channel._id);
    const status = res.data.data.subscribed;
    setSubscribed(status);
    setSubCount((prev) => (status ? prev + 1 : prev - 1));
  };

  if (!channel) return <h2>Loading channel...</h2>;

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className={`channel-page ${sidebar ? "" : "channel-page-grow"}`}>
        {/* Cover */}
        <div className="channel-cover">
          <img src={channel.coverImage} alt="cover" />
        </div>

        {/* Header */}
        <div className="channel-header">
          <img className="channel-avatar" src={channel.avatar} alt="avatar" />

          <div className="channel-info">
            <h2>{channel.username}</h2>
            <p>{subCount} subscribers</p>
          </div>

          {/* <button
          className={subscribed ? "subscribed" : "subscribe"}
          onClick={handleSubscribe}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button> */}
        </div>

        {/* Tabs */}
        <div className="channel-tabs">
          <span
            className={activeTab === "videos" ? "active" : ""}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </span>
          <span
            className={activeTab === "about" ? "active" : ""}
            onClick={() => setActiveTab("about")}
          >
            About
          </span>
          <span
            className={activeTab === "playlist" ? "active" : ""}
            onClick={() => setActiveTab("playlist")}
          >
            Playlists
          </span>
        </div>

        {/* Content */}
        {activeTab === "videos" && (
          <div className="channel-videos">
            {videos.map((video) => (
              <Link to={`/video/getVideo/${video._id}`} key={video._id}>
                <div className="vid-card">
                  <div className="thumbnail-box">
                    <img src={video.thumbnail} alt="" />
                    <p className="duration">{formatDuration(video.duration)}</p>
                  </div>
                  <h4>{video.title}</h4>
                  <p>{video.views} views</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="channel-about">
            <p>This is {channel.username}'s YouTube channel.</p>
          </div>
        )}

        {activeTab === "playlist" && (
          <div className="channel-playlists">
            {playlists.length === 0 ? (
              <p className="empty-text">No playlists yet</p>
            ) : (
              playlists.map((pl) => (
                <Link
                  to={`/playlist/${pl._id}`}
                  key={pl._id}
                  className="channel-playlist-card"
                >
                  <div className="channel-playlist-thumb">
                    {pl.videos?.length > 0 ? (
                      <img src={pl.videos[0].thumbnail} alt="" />
                    ) : (
                      <div className="empty-thumb">No Videos</div>
                    )}
                    <span className="playlist-count">
                      {pl.videos.length} videos
                    </span>
                  </div>

                  <div className="channel-playlist-info">
                    <h4>{pl.name}</h4>
                    <p>{channel.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChannelProfile;
