import { useState } from "react"
import { addComment } from "../utils/auth";

import '../componentSytles/Comment.css';

export const CommentBox = ({videoId, onCommentAdded}) =>{
        const [text, setText] = useState("");

        const handleSubmit = async (e) =>{
            e.preventDefault();

            if(!text.trim()) return;

           try {
             await addComment(videoId, text);
             setText("");
             onCommentAdded();
           } catch (error) {
            console.log(error)
           }
        }

        return (
            <div >
                <div className="comment-box">
                         <textarea placeholder="Add a comment..." value={text} onChange={(e)=> setText(e.target.value)}/>
                </div>
               

                <button className="post-btn" onClick={handleSubmit}> Comment</button>
            </div>
        )
}
