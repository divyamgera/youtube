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

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      setSubscribed(channel.isSubscribed || false);
      setSubscribersCount(channel.subscribersCount || 0);
    }
  }, [channel]);

  const handleSubscribe = async () => {
    if (!currentUser) {
      toast.info("Please login to subscribe");
      return;
    }

    if (loading) return;

    // Confirm before unsubscribe
    if (subscribed) {
      const confirm = window.confirm(
        "Do you really want to unsubscribe?"
      );
      if (!confirm) return;
    }

    try {
      setLoading(true);

      const res = await subscribeChannel(video.owner._id);

      const {
        subscribed: backendSubscribed,
        subscribersCount: backendCount,
      } = res.data.data;

      setSubscribed(backendSubscribed);
      setSubscribersCount(backendCount);

      toast.success(
        backendSubscribed
          ? "Subscribed successfully"
          : "Unsubscribed successfully"
      );
    } catch (error) {
      console.log("SUBSCRIBE ERROR:", error);
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