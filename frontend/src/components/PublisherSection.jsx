import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { subscribeChannel } from "../utils/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../componentSytles/PlayVideo.css";

export const PublisherSection = ({ video, channel }) => {
  const { user: currentUser } = useAuth();

  const isOwnChannel =
    currentUser &&
    video &&
    String(currentUser?.data?._id) === String(video.owner._id);

  const [subscribed, setSubscribed] = useState(
    channel?.isSubscribed || false
  );
  const [subscribersCount, setSubscribersCount] = useState(
    channel?.subscribersCount || 0
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSubscribed(channel?.isSubscribed || false);
    setSubscribersCount(channel?.subscribersCount || 0);
  }, [channel]);

  const handleSubscribe = async () => {
    if (!currentUser) {
      toast.info("Please Login to Subscribe");
      return;
    }

    if (loading) return;

    const previousSubscribed = subscribed;
    const previousCount = subscribersCount;

    const optimisticSubscribed = !previousSubscribed;

    setSubscribed(optimisticSubscribed);
    setSubscribersCount((prev) =>
      optimisticSubscribed ? prev + 1 : prev - 1
    );

    try {
      setLoading(true);

      const res = await subscribeChannel(video.owner._id);

      const {
        subscribed: backendSubscribed,
        subscribersCount: backendCount,
      } = res.data.data;

      setSubscribed(backendSubscribed);
      setSubscribersCount(backendCount);

    } catch (error) {
      console.log("SUBSCRIBE ERROR:", error);

      setSubscribed(previousSubscribed);
      setSubscribersCount(previousCount);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publisher">
      <Link
        to={`/users/c/${video.owner?.username}`}
        className="publisher-info"
      >
        <img src={video.owner?.avatar} alt="avatar" />
        <div>
          <p>{video.owner?.username}</p>
          <span>{subscribersCount} Subscribers</span>
        </div>
      </Link>

      {currentUser && video && !isOwnChannel && (
        <button
          disabled={loading}
          className={subscribed ? "subscribed-btn" : "subscribe-btn"}
          onClick={handleSubscribe}
        >
          {loading
            ? "Processing..."
            : subscribed
            ? "Subscribed"
            : "Subscribe"}
        </button>
      )}
    </div>
  );
};