
import "../pagesStyles/Home.css";
import { Sidebar } from "../components/Sidebar";
import { Feed } from "../components/Feed";
import { VideoCard } from "../components/VideoCard";


export const Home = ({ sidebar }) => {
  return (
    <>
      {/* <Navbar /> */}
      <Sidebar sidebar={sidebar} />
     
        <div className={`container ${sidebar ? "" : "large-container"}`}>
          <Feed />
          {/* <VideoCard/> */}
        </div>
      
    </>
  );
};
