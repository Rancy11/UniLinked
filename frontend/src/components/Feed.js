import React, { useState, useEffect } from "react";
import API from "../api";
import Post from "./Post"; // import your Post component

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
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

  const handleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      setError("Failed to like post");
    }
  };

  return (
    <div className="feed-container">
      {/* Create Post */}
      <div className="create-post-card">
        <h3>Create Post</h3>
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            rows="3"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Posts */}
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to post!</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            user={user}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
