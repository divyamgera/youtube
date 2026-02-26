import { useState } from "react";
import "../pagesStyles/UpdateUserProfile.css";
import {
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../utils/auth";
import { toast } from "react-toastify";
import { useRef } from "react";
import { Sidebar } from "../components/Sidebar";

const UpdateUserProfile = ({ sidebar }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleDetailsUpdate = async (e) => {
    e.preventDefault();
    await updateAccountDetails(fullName, email);
    toast.success("Details Updated");
  };

  const handleAvatarUpdate = async () => {
    if (!avatar) return toast.error("Select avatar first");
    const data = new FormData();
    data.append("avatar", avatar);
    await updateAvatar(data);
    toast.success("Avatar Updated");
  };

  const handleCoverUpdate = async () => {
    if (!coverImage) return toast.error("Select cover first");
    const data = new FormData();
    data.append("coverImage", coverImage);
    await updateCoverImage(data);
    toast.success("Cover Updated");
  };
  const coverInputRef = useRef(null);

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className={`profile-container ${sidebar ? "": "profile-container-grow"} `}>
        <h2>Edit Profile</h2>

        {/* COVER */}
        <div className="cover-section">
          <div className="cover-preview">
            {coverImage && (
              <img src={URL.createObjectURL(coverImage)} alt="cover" />
            )}
          </div>

          {/* HIDDEN INPUT */}
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            style={{ display: "none" }}
            onChange={(e) => setCoverImage(e.target.files[0])}
          />

          <div className="cover-actions">
            <button
              type="button"
              className="btn"
              onClick={() => coverInputRef.current.click()}
            >
              Choose Cover
            </button>

            <button
              type="button"
              className="btn primary"
              onClick={handleCoverUpdate}
            >
              Save Cover
            </button>
          </div>
        </div>

        {/* AVATAR */}
        <div className="avatar-section">
          <div className="avatar-preview">
            {avatar && <img src={URL.createObjectURL(avatar)} alt="avatar" />}
          </div>

          <div className="avatar-actions">
            <label className="btn">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
            <button className="btn primary" onClick={handleAvatarUpdate}>
              Save Avatar
            </button>
          </div>
        </div>

        {/* DETAILS */}
        <form className="details-card" onSubmit={handleDetailsUpdate}>
          <h4>Account Details</h4>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn primary" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateUserProfile;
