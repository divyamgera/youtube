import { useState } from "react";
import { changePassword } from "../utils/auth";
import { toast } from "react-toastify";

import "../modalSytles/ChangePasswordModal.css";

export const ChangePassword = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!oldPassword || !newPassword) {
      return setError("All fields are required");
    }
    try {
      setLoading(true);
      await changePassword({ oldPassword, newPassword });
      onClose();
      setOldPassword("");
      setNewPassword("");
      toast.success("Password changed successfully");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to change Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-modal-overlay">
      <div className="cp-modal">
        <h3>Change Password</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {error && <p className="cp-error">{error}</p>}

          <div className="cp-actions">
            <button type="button" onClick={onClose} className="cp-cancel">
              Cancel
            </button>

            <button type="submit" className="cp-save" disabled={loading}>
              {loading ? "Changing..." : "Change"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
