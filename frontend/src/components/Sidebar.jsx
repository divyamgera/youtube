
import { Link } from "react-router-dom";
import "../componentSytles/Sidebar.css";

import {
  MdHomeFilled,
  MdHistory,
  MdVideoLibrary,
  MdOutlineSubscriptions,
  MdOutlinePlaylistPlay,
  MdThumbUpOffAlt,
  MdOutlineExplore,
} from "react-icons/md";

import {
  FaFireAlt,
  FaMusic,
  FaGamepad,
  FaNewspaper,
} from "react-icons/fa";

export const Sidebar = ({ sidebar }) => {
  return (
    <aside className={`sidebar ${sidebar ? "" : "small-sidebar"}`}>

      {/* MAIN */}
      <div className="sidebar-section">
        <Link to="/" className="side-link active">
          <MdHomeFilled className="icon" />
          <p>Home</p>
        </Link>

        <div className="side-link">
          <MdOutlineExplore className="icon" />
          <p>Explore</p>
        </div>

        <div className="side-link">
          <Link to="/subscriptions">
          <MdOutlineSubscriptions className="icon" /></Link>
          <p>Subscriptions</p>
          
        </div>
      </div>

      <hr />

      {/* YOU */}
      <div className="sidebar-section">
        <h4>You</h4>

        <div className="side-link">
          <MdVideoLibrary className="icon" />
          <p>Library</p>
        </div>

        <div className="side-link">
          <Link to="/watchhistory">
          <MdHistory className="icon" /> </Link>
          <p>History</p>
        </div>

        <div className="side-link">
          <Link to="/myplaylists">
          <MdOutlinePlaylistPlay className="icon" /> </Link>
          <p>Playlists</p>
        </div>

        <div className="side-link">
          <Link to="/likedVideos">
          <MdThumbUpOffAlt className="icon" /> </Link>
          <p>Liked Videos</p>
        </div>
      </div>

      <hr />

      {/* EXPLORE */}
      <div className="sidebar-section">
        <h4>Explore</h4>

        <div className="side-link">
          <FaFireAlt className="icon" />
          <p>Trending</p>
        </div>

        <div className="side-link">
          <FaMusic className="icon" />
          <p>Music</p>
        </div>

        <div className="side-link">
          <FaGamepad className="icon" />
          <p>Gaming</p>
        </div>

        <div className="side-link">
          <FaNewspaper className="icon" />
          <p>News</p>
        </div>
      </div>

    </aside>
  );
};
