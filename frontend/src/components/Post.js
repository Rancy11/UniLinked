import React, { useState, useEffect } from "react";
import API from "../api";

const Post = ({ post, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [posting, setPosting] = useState(false);
  const [likeCount, setLikeCount] = useState(Array.isArray(post.likes) ? post.likes.length : 0);
  const [liked, setLiked] = useState(
    user && Array.isArray(post.likes) ? post.likes.includes(user.id) || post.likes.some(l => l === user.id || l?._id === user.id) : false
  );
  const [likingInProgress, setLikingInProgress] = useState(false);

  useEffect(() => {
    if (showComments) {
      API.get(`/posts/${post._id}/comments`)
        .then((res) => setComments(res.data))
        .catch((err) => console.error(err));
    }
  }, [post._id, showComments]);

  const handleLike = async () => {
    if (!user || likingInProgress) return;
    setLikingInProgress(true);
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      // Sync with server response
      const serverLikes = Array.isArray(res.data.likes) ? res.data.likes : [];
      setLikeCount(serverLikes.length);
      setLiked(serverLikes.includes(user.id) || serverLikes.some(l => l === user.id || l?._id === user.id));
    } catch (err) {
      // Revert on failure
      setLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    setPosting(true);
    API.post(`/posts/${post._id}/comments`, { text: newComment })
      .then((res) => {
        setComments([...comments, res.data]);
        setNewComment("");
      })
      .catch((err) => console.error(err))
      .finally(() => setPosting(false));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  const authorName = post.author?.name || "Unknown User";
  const initials = authorName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-avatar">{initials}</div>
        <div className="post-meta">
          <div className="post-author-name">{authorName}</div>
          <div className="post-time">{timeAgo(post.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Divider */}
      <div className="post-divider" />

      {/* Actions */}
      <div className="post-actions">
        {user && (
          <button
            className="post-action-btn"
            onClick={handleLike}
            disabled={likingInProgress}
            style={{
              color: liked ? '#e74c3c' : undefined,
              fontWeight: liked ? 700 : undefined,
            }}
          >
            {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : ''} Like{likeCount !== 1 ? 's' : ''}
          </button>
        )}
        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {comments.length > 0 ? comments.length : ""} Comments
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="comments-section">
          <h4>Comments</h4>

          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first!</p>
          ) : (
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c._id} className="comment">
                  <strong>{c.user?.name || "Unknown"}:</strong>{" "}
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          )}

          {user && (
            <div className="add-comment">
              <input
                type="text"
                placeholder="Write a comment... (Enter to post)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleComment} disabled={posting || !newComment.trim()}>
                {posting ? "..." : "Post"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;