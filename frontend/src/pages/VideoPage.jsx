

import "../pagesStyles/VideoPage.css";
import { PlayVideo } from "../components/PlayVideo";
import { Recommended } from "../components/Recommended";
import { Sidebar } from "../components/Sidebar";

const VideoPage = ({sidebar}) => {
  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className={`play-container ${sidebar ? "" : "play-large-container"}`}>
         
        <PlayVideo />
        <Recommended />
      </div>
    </>
  );
};

export default VideoPage;
