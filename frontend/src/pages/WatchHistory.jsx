import "../pagesStyles/WatchHistory.css";
import WatchHistoryItem from "../components/WatchHistoryItem";
import { useEffect, useState } from "react";
import { watchHistory } from "../utils/auth";
import { Sidebar } from "../components/Sidebar";
import AvatarLoader from "../components/AvatarLoader";
import { isToday, isYesterday } from "../utils/dataeUtils";

const WatchHistory = ({ sidebar }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await watchHistory();
        setHistory(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // 🔥 GROUPING
  const todayHistory = history.filter((h) => isToday(h.watchedAt));
  const yesterdayHistory = history.filter((h) => isYesterday(h.watchedAt));
  // const olderHistory = history.filter(
  //   (h) => !isToday(h.watchedAt) && !isYesterday(h.watchedAt),
  // );

  const olderRaw = history.filter(
    (h) => !isToday(h.watchedAt) && !isYesterday(h.watchedAt),
  );

  // Remove duplicates in Earlier (keep latest only)
  const olderMap = new Map();

  olderRaw
    .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
    .forEach((item) => {
      if (!olderMap.has(item.video._id)) {
        olderMap.set(item.video._id, item);
      }
    });

  const olderHistory = Array.from(olderMap.values());

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className={`history-page ${sidebar ? "" : "history-page-grow"}`}>
        <h2 className="history-title">Watch history</h2>

        {loading && <AvatarLoader />}

        {/* {!loading && history.length === 0 && (
          <p>No watch history yet</p>
        )} */}

        {/* TODAY */}
        {todayHistory.length > 0 && (
          <div className="history-section">
            <p className="history-date">Today</p>
            {todayHistory.map((hist) => (
              <WatchHistoryItem
                key={`${hist.video._id}-${hist.watchedAt}`}
                hist={hist}
              />
            ))}
          </div>
        )}

        {/* YESTERDAY */}
        {yesterdayHistory.length > 0 && (
          <div className="history-section">
            <p className="history-date">Yesterday</p>
            {yesterdayHistory.map((hist) => (
              <WatchHistoryItem
                key={`${hist.video._id}-${hist.watchedAt}`}
                hist={hist}
              />
            ))}
          </div>
        )}

        {/* OLDER */}
        {olderHistory.length > 0 && (
          <div className="history-section">
            <p className="history-date">Earlier</p>
            {olderHistory.map((hist) => (
              <WatchHistoryItem
                key={`${hist.video._id}-${hist.watchedAt}`}
                hist={hist}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WatchHistory;
