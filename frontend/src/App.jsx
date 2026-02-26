import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import ProtectedRoute from "./components/ProtectedRoute";
import ChannelProfile from "./pages/ChannelProfile";
import UpdateChannel from "./pages/UpdateChannel";
import UpdateUserProfile from "./pages/UpdateUserProfile";
import Subscriptions from "./pages/Subscriptions";
import WatchHistory from "./pages/WatchHistory";
import SearchResults from "./pages/SearchResults";
import MyPlaylists from "./pages/MyPlaylists";
import PlaylistDetail from "./pages/PlaylistDetail";
import LikedVideos from "./pages/LikedVideos";

const App = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div>
      <Navbar setSidebar={setSidebar} />

      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route
          path="/video/:categoryId/:videoId"
          element={<VideoPage sidebar={sidebar} />}
        />
        <Route path="/login" element={<Login sidebar={sidebar} />} />
        <Route path="/register" element={<Register sidebar={sidebar} />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route
          path={`/users/c/:username`}
          element={
            <ProtectedRoute>
              <ChannelProfile sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/updatechannel"
          element={
            <ProtectedRoute>
              <UpdateChannel sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/updateProfile"
          element={
            <ProtectedRoute>
              <UpdateUserProfile sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watchhistory"
          element={
            <ProtectedRoute>
              <WatchHistory sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route path="/search" element={<SearchResults sidebar={sidebar} />} />

        <Route
          path="/myplaylists"
          element={
            <ProtectedRoute>
              <MyPlaylists sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlist/:playlistId"
          element={<PlaylistDetail sidebar={sidebar} />}
        />


        <Route
          path="/likedVideos"
          element={
            <ProtectedRoute>
              <LikedVideos sidebar={sidebar} />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
};

export default App;
