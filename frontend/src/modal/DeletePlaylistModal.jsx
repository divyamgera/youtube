import { useState } from "react";


export const DeletePlaylistModal = ({open, onClose, onDelete}) => {

    // const [deleteModal, setDeleteModal] = useState(false);
    if(!open) return null;

  return (
    <>
      {/* DELETE MODAL */}
       
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Delete Playlist?</h3>
            <p>Are you sure you want to delete this playlist?</p>

            <div className="delete-actions">
              <button
                className="cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={onDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      
    </>
  );
};
