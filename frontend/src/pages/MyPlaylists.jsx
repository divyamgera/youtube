import { useEffect, useState } from "react";
import { getMyPlaylists, deletePlaylist } from "../utils/playlist";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import { Sidebar } from "../components/Sidebar";
import "../pagesStyles/MyPlaylists.css";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { DeletePlaylistModal } from "../modal/DeletePlaylistModal";
import AvatarLoader from "../components/AvatarLoader";

const MyPlaylists = ({ sidebar }) => {
  const [playlists, setPlaylists] = useState([]); // user ki saari playlists store hoti hain
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false); // create playlist modal open/close karne ke liye

  const [menuOpen, setMenuOpen] = useState(null); //
  const [deleteModal, setDeleteModal] = useState(false); //
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); //

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getMyPlaylists(user.data._id);
      setPlaylists(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const openDeleteModal = (pl) => {
    setSelectedPlaylist(pl);
    setDeleteModal(true);
    setMenuOpen(null);
  };

  const handleDelete = async () => {
    try {

      await deletePlaylist(selectedPlaylist._id);
      setPlaylists((prev) =>
        prev.filter((p) => p._id !== selectedPlaylist._id),
      );
      setDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className={`playlist-page ${sidebar ? "" : "playlist-page-grow"}`}>
        <h2 className="playlist-title">My Playlists</h2>

        {loading && <AvatarLoader/>}
        {!loading && playlists.length === 0 && (
          <p className="empty-text">No playlists yet</p>
        )}

        <div className="playlist-grid">
          {playlists.map((pl) => (
            <div key={pl._id} className="playlist-card">
              <div
                className="playlist-thumb"
                onClick={() => navigate(`/playlist/${pl._id}`)}
              >
                {pl.videos?.length > 0 ? (
                  <img src={pl.videos[0].thumbnail} alt="" />
                ) : (
                  <div className="empty-thumb">No Videos</div>
                )}
              </div>

              <div className="playlist-info-row">
                <div className="playlist-info">
                  <h4>{pl.name}</h4>
                  <p>{pl.videos.length} videos</p>
                </div>

                {/* THREE DOTS */}
                <div
                  className="playlist-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === pl._id ? null : pl._id);
                  }}
                >
                  ⋮
                </div>

                {menuOpen === pl._id && (
                  <div className="playlist-dropdown">
                    <button onClick={() => openDeleteModal(pl)}>
                      Delete Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="create-section">
          <button onClick={() => setOpenCreate(true)}>
            ➕ Create New Playlist
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      {/* {deleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Delete Playlist?</h3>
            <p>Are you sure you want to delete this playlist?</p>

            <div className="delete-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}

      <DeletePlaylistModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onDelete={handleDelete}
      />

      <CreatePlaylistModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={(pl) => setPlaylists([pl, ...playlists])}
      />
    </>
  );
};

export default MyPlaylists;
