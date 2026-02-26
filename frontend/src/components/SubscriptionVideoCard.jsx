
import { Link } from 'react-router-dom';
import '../componentSytles/subscriptionVideoCard.css'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const SubscriptionVideoCard = ({video}) =>{
    return (
        <Link to={`/video/getVideo/${video._id}`}>
        <div className="sub-video-card">
            <div className="thumbnail-box">
                <img src={video.thumbnail} alt="thumb" />
            </div>
     

        <div className="video-info">
                <img src={video?.owner?.avatar} alt="" className="channel-avatar"/>

                <div className="video-text">
                    <h4 className="video-title">
                        {video.title}
                    </h4>
                    <p className="channel-name">@{video?.owner?.username}</p>
                    <p className="video-meta">{video.views} views • {dayjs(video.createdAt).fromNow()}</p>
                </div>
        </div>
        </div></Link>
    )
}
export default SubscriptionVideoCard;