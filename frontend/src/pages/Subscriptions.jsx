import { useEffect, useState } from "react";
import "../pagesStyles/Subscriptions.css";
import { subscriptionsFeed } from "../utils/auth";
import { Sidebar } from "../components/Sidebar";
import AvatarLoader from "../components/AvatarLoader";
import { VideoCard } from "../components/VideoCard";

const Subscriptions = ({ sidebar }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await subscriptionsFeed();
        setVideos(res.data.data.videos);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className="subscriptions-page">
        <h2 className="subscriptions-title">Subscriptions</h2>

        {loading ? (
          <div className="subscriptions-loader">
            <AvatarLoader />
          </div>
        ) : videos.length === 0 ? (
          <div className="subscriptions-empty">
            <h3>No videos from subscriptions</h3>
            <p>Subscribe to channels to see their latest uploads here.</p>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Subscriptions;