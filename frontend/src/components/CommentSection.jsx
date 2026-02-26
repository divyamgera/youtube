import React, { useEffect, useState } from "react";
import { getCommentsByVideo } from "../utils/auth";
import { CommentBox } from "./CommentBox";
import CommentList from "./CommentList";
import '../componentSytles/Comment.css'

export const CommentSection = ({videoId}) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    const res = await getCommentsByVideo(videoId);
    //  console.log("COMMENTS API RESPONSE 👉", res.data);
    setComments(res.data.message); // ⚠️ yaha dhyan
  };

  return (
    <>
      <div className="comments-section">
        <h4>{comments.length} Comments</h4>
        <CommentBox videoId={videoId} onCommentAdded={loadComments} />
        <CommentList comments={comments} onRefresh={loadComments} />
      </div>
    </>
  );
};
