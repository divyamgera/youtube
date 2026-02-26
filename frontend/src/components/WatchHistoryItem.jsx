import "../pagesStyles/WatchHistory.css";
import { VideoCard } from "./VideoCard";


const WatchHistoryItem = ({ hist }) => {
  if (!hist?.video) return null;

  const { video } = hist;

  return (
    <>

    <VideoCard video={video} variant="list" />

    {/* <div className="history-item">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="history-thumbnail"
      />

      <div className="history-info">
        <h4 className="history-title">{video.title}</h4>

        <div className="history-channel">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="history-avatar"
          />
          <span>{video.owner.username}</span>
        </div>
      </div>
    </div> */}
    
    </>
    
  );
};

export default WatchHistoryItem;
