

import { useState } from "react";
import { updatePlaylist } from "../utils/playlist";
import "../componentSytles/EditPlaylistModal.css";

const EditPlaylistModal = ({ open, onClose, playlist, onUpdated }) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updatePlaylist(playlist._id, {
        name,
        description,
      });

      onUpdated(res.data.data);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edit playlist</h3>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Playlist name"
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
