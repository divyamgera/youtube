import Comment from "../components/Comment.jsx";

const CommentList = ({ comments, onRefresh }) => {
     if (!Array.isArray(comments)) return null;
  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onRefresh={onRefresh}
        />
      ))}
    </>
  );
};

export default CommentList;
