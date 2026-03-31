import React, { useState, useEffect } from "react";
import API from "../api";
import Post from "./Post";

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setFetching(true);
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setFetching(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await API.post("/posts", { content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost("");
    } catch (err) {
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="feed-container">

      {/* Create Post */}
      {user && (
        <div className="create-post-card">
          <div className="create-post-header">
            <div className="create-post-avatar">{initials}</div>
            <h3>What's on your mind?</h3>
          </div>
          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with your university network..."
              rows="3"
              required
            />
            <div className="post-form-footer">
              <span className="char-count">
                {newPost.length > 0 ? `${newPost.length} characters` : ""}
              </span>
              <button type="submit" disabled={loading || !newPost.trim()}>
                {loading && <span className="loading-spinner"></span>}
                {loading ? "Posting..." : "✦ Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="error-message">⚠ {error}</div>}

      {/* Posts */}
      {fetching ? (
        <div className="feed-empty">
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="feed-empty">
          <p>🌟 No posts yet. Be the first to post!</p>
        </div>
      ) : (
        posts.map((post, i) => (
          <Post
            key={post._id}
            post={post}
            user={user}
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))
      )}
    </div>
  );
};

export default Feed;