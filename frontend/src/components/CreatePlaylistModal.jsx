// import '../componentSytles/CreatePlaylistModal.jsx';
// import '../componentSytles/CreatePlaylistModal.jsx';

import { useState } from "react";
import { createPlaylist } from "../utils/playlist.js";

const CreatePlaylistModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await createPlaylist({ name, description });
      onCreated?.(res.data.data);
      onClose();
      setName("");
      setDescription("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Create playlist</h3>

        <input
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
