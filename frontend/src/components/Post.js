import React, { useState, useEffect } from "react";
import API from "../api";

const Post = ({ post, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments for this post
  useEffect(() => {
    // This fetches all existing comments for the post
    API.get(`/posts/${post._id}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [post._id]);

  // Handle adding a new comment
  const handleComment = () => {
    if (!newComment.trim()) return;

    // Make the API call to add the comment
    API.post(`/posts/${post._id}/comments`, { text: newComment })
      .then((res) => {
        // The backend should return the single new comment object.
        // We add this new object to the existing comments array.
        setComments([...comments, res.data]);
        
        // Clear the input field after successful post
        setNewComment(""); 
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="post-card">
      <p>{post.content}</p>
      <p className="post-author">Posted by: {post.author.name}</p>

      <div className="comments-section">
        <h4>Comments</h4>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <div key={c._id} className="comment">
            {/* The `c.user.name` is what caused the rendering issue.
                The backend must now send a populated user object. */}
            <strong>{c.user.name}:</strong> {c.text}
          </div>
        ))}

        {user && (
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleComment}>Post</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;