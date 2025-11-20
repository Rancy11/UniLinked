const express = require("express");
const router = express.Router();
const Post = require("../models/Posts");
const { auth } = require("../middleware/auth");
const User = require("../models/User"); // Assuming you have a User model

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name role")
      .populate("comments.user", "name") // populate comment user names
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new post (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      content,
      author: req.user.id
    });

    await post.save();
    
    await post.populate("author", "name role");
    
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Like/unlike post (protected)
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete post (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== COMMENTS ROUTES ===================== //

// Get all comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a comment to a post (protected)
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Create the new comment object
    const newComment = {
      user: req.user.id,
      text,
    };

    // Add the new comment to the post's comments array and save
    post.comments.push(newComment);
    await post.save();

    // Get the newly added comment from the sub-document array
    const createdComment = post.comments[post.comments.length - 1];

    // Find the user's details to manually populate
    const user = await User.findById(req.user.id).select('name');
    
    // Construct the final comment object with populated user data
    const finalComment = {
        _id: createdComment._id,
        text: createdComment.text,
        user: {
            _id: user._id,
            name: user.name,
        },
    };

    res.json(finalComment); // return the corrected, fully-formed comment object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;