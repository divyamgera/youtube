import "../componentSytles/SaveToPlaylistModal.css";
import { useState } from "react";
import CreatePlaylistModal from "./CreatePlaylistModal";

import { addVideoToPlaylist } from "../utils/playlist";
import { toast } from "react-toastify";

const SaveToPlaylistModal = ({ open, onClose, playlists, videoId }) => {
  const [showCreate, setShowCreate] = useState(false);

  const [loadingId, setLoadingId] = useState(null);

  if (!open) return null;

  const handleAdd = async (playlistId) => {
    try {
      setLoadingId(playlistId);
      await addVideoToPlaylist(playlistId, videoId);
      toast.success("Video added to playlist");

      onClose();
    } catch (error) {
      console.log(error.response?.data?.message || error.messsage);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Save to…</h3>

          <div className="playlist-list">
            {playlists.length === 0 && (
              <p className="empty-text">No playlists yet</p>
            )}

            {Array.isArray(playlists) &&
              playlists.map((pl) => (
                // <label key={pl._id} className="playlist-item">
                //   <input type="checkbox" />
                //   {pl.name}
                // </label>

                <div
                  key={pl._id}
                  className="playlist-item clickable"
                  onClick={() => handleAdd(pl._id)}
                >
                  <span>{pl.name}</span>
                  {loadingId === pl._id && <span>⏳</span>}
                </div>
              ))}
          </div>

          <button className="create-btn" onClick={() => setShowCreate(true)}>
            ➕ Create new playlist
          </button>

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <CreatePlaylistModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </>
  );
};

export default SaveToPlaylistModal;
