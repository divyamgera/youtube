import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getUserChannelProfile,
  getUserChannelVideos,
  subscribeChannel,
} from "../utils/auth";
import { getChannelPlaylists } from "../utils/playlist";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../utils/AuthContext";
import AvatarLoader from "../components/AvatarLoader";
import { VideoCard } from "../components/VideoCard";
import "../pagesStyles/ChannelProfile.css";

const ChannelProfile = ({ sidebar }) => {
  const { username } = useParams();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);


  const loadChannel = useCallback(async () => {
    try {
      setLoading(true);

      const [profileRes, videoRes, playlistRes] = await Promise.all([
        getUserChannelProfile(username),
        getUserChannelVideos(username),
        getChannelPlaylists(username),
      ]);

      const profile = profileRes.data.data;

      setChannel(profile);
      setSubscribed(profile.isSubscribed);
      setSubCount(profile.subscribersCount);

      setVideos(videoRes.data.data || []);
      setPlaylists(playlistRes.data.data || []);
    } catch (err) {
      console.error("Channel load error:", err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

  const handleSubscribe = async () => {
    if (!channel || subLoading) return;

    try {
      setSubLoading(true);

      const optimisticState = !subscribed;
      setSubscribed(optimisticState);
      setSubCount((prev) => prev + (optimisticState ? 1 : -1));

      const res = await subscribeChannel(channel._id);
      const serverStatus = res.data.data.subscribed;

      setSubscribed(serverStatus);
      setSubCount((prev) =>
        serverStatus === optimisticState ? prev : prev + (serverStatus ? 1 : -1)
      );
    } catch (err) {
      console.error("Subscribe error:", err);

      setSubscribed((prev) => !prev);
      setSubCount((prev) => prev + (subscribed ? -1 : 1));
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) return <AvatarLoader />;
  if (!channel) return null;

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className={`channel-page ${sidebar ? "" : "channel-page-grow"}`}>
        {/* COVER */}
        <div className="channel-cover">
          <img src={channel.coverImage} alt="cover" />
        </div>

        {/* HEADER */}
        <div className="channel-header">
          <img className="channel-avatar-b" src={channel.avatar} alt="avatar" />

          <div className="channel-info">
            <h2>{channel.username}</h2>
            <p>{subCount.toLocaleString()} subscribers</p>
          </div>

          {user?.data?._id !== channel._id && (
            <button
              className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
              onClick={handleSubscribe}
              disabled={subLoading}
            >
              {subLoading
                ? "Please wait..."
                : subscribed
                ? "Subscribed"
                : "Subscribe"}
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="channel-tabs">
          {["videos", "playlist", "about"].map((tab) => (
            <span
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === "videos" && (
          <div className="channel-videos">
            {videos.length === 0 ? (
              <p className="empty-text">No videos yet</p>
            ) : (
              videos.map((video) => (
                <VideoCard key={video._id} video={video} variant="grid" />
              ))
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="channel-about">
            <p>This is {channel.username}'s channel.</p>
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