import { useState } from "react";
import axios from "axios";

import "../pagesStyles/Upload.css";
import { Sidebar } from "../components/Sidebar";
import { uploadVideo } from "../utils/auth";

const Upload = ({ sidebar }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !video) {
      return alert("Title aur Video required hai");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("videoFile", video);
    formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      const res = await uploadVideo(formData);

      setMessage("✅ Video Uploaded Successfully!");

      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setVideo(null);
      setThumbnail(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar sidebar={sidebar} />

      <div className="upload-container">
        <h2>Upload Video</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <label>Upload Video</label>
          <input
            type="file"
            accept="videoFile/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />

          <label>Upload Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          <button disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>

          {message && <p className="upload-message">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default Upload;
