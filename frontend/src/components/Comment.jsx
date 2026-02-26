import { deleteComment } from "../utils/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import '../componentSytles/Comment.css';
import { useAuth } from "../utils/AuthContext";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

const Comment = ({ comment, onRefresh }) => {
  const {user} = useAuth();
  const handleDelete = async () => {
    if(user.data){
         await deleteComment(comment._id);
    onRefresh();
    }else {
      toast.info("Please Login to continue")
    }
   

  };

  return (
    <div className="comment">
      <img src={comment.owner.avatar} alt="" />

      <div>
        <h4>
          {/* {comment.user.username} */}
          <span> · {dayjs(comment.createdAt).fromNow()}</span>
        </h4>

        <p>{comment.comment}</p>

        {comment.owner?._id && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default Comment;
