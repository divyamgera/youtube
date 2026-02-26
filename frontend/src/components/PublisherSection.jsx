import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { subscribeChannel } from "../utils/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const PublisherSection = ({video,channel}) => {

    const [subscribed, setSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount ] = useState(false);

         const { user: currentUser } = useAuth();
         const isOwnChannel =
    currentUser && video && String(currentUser?.data?._id) === String(video.owner._id);

     const handleSubscribe = async () => {
        try {

          if(currentUser.data){
                const res = await subscribeChannel(video.owner._id);
          console.log("res subs::", res);
          const isNowSubscribed = res.data.data.subscribed;
    
          console.log(isNowSubscribed);
    
          setSubscribed(isNowSubscribed);
          setSubscribersCount((prev) => (isNowSubscribed ? prev + 1 : prev - 1));
          } else {
            toast.info("Please Login to Subscribe")
          }

        
        } catch (err) {
          console.log("SUBSCRIBE ERROR:", err);
        }
      };
  return (
    <>
      <div className="publisher">
        <Link
          to={`/users/c/${video.owner?.username}`}
          className="publisher-info"
        >
          <img src={video.owner?.avatar} alt="avatar" />
          <div>
            <p>{video.owner?.username}</p>
            <span>{channel?.subscribersCount} Subscribers</span>
          </div>
        </Link>

        {currentUser && video && !isOwnChannel && (
          <button
            className={subscribed ? "subscribed-btn" : ""}
            onClick={handleSubscribe}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
    </>
  );
};
