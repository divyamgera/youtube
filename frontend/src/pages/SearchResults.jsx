import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchVideos } from "../utils/auth";

// import { Feed } from "../components/Feed";
import AvatarLoader from "../components/AvatarLoader";
import { Sidebar } from "../components/Sidebar";
import '../pagesStyles/Home.css'
import { VideoCard } from "../components/VideoCard";

const SearchResults = ({ sidebar }) => {
  const [params] = useSearchParams();

  const query = params.get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        setLoading(true);

        const res = await searchVideos(query);
        // console.log("11",res.data);
        console.log("22",res.data.data.results);
        setVideos(res.data.data.results);
      } catch (error) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if(query){
         fetchSearch();
    }

   
  }, [query]);

  return (
    <>
      <Sidebar sidebar={sidebar} />
      <div className={`container ${sidebar ? "" : "large-container"}`}>
        <h2>Search results for "{query}"</h2>

        {loading && <AvatarLoader />}

        {!loading && videos.length === 0 && <p>No results found</p>}

        {videos.map((video) => (
          // <Feed key={video._id} video={video} />
          <VideoCard key={video._id} video={video} variant="compact" />
        ))}
      </div>
    </>
  );
};

export default SearchResults;
