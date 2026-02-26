import { useEffect, useState } from "react";
import SubscriptionVideoCard from "../components/SubscriptionVideoCard";
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
        // console.log(res.data.data);
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
      <div
        className={`subscriptions-page ${sidebar ? "" : "subscriptions-page-grow"}`}
      >
        <h2 className="subscriptions-title">Subscriptions</h2>
        <div className="subscriptions-grid">
          {loading ? (
            <AvatarLoader />
          ) : (
            videos.map((video) => (
              // <SubscriptionVideoCard key={video._id} video={video} />
              <VideoCard key={video._id} video={video} variant="grid" />
            ))
          )}
        </div>
      </div>
    </>
  );
  c;
};

export default Subscriptions;
