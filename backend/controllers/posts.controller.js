const Post = require("../models/Post");
const { validationResult } = require("express-validator");

// Helper function to populate post data
const populatePost = async (postId) => {
  return await Post.findById(postId)
    .populate("author", "name avatar")
    .populate("comments.user", "name avatar")
    .populate("likes.user", "name avatar");
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await populatePost(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, image, tags } = req.body;

    const post = new Post({
      title,
      content,
      image,
      tags,
      author: req.user._id,
    });

    const createdPost = await post.save();
    const populatedPost = await populatePost(createdPost._id);

    // Emit new post to all connected clients
    req.app.get("io").emit("newPost", populatedPost);

    res.status(201).json(populatedPost);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { title, content, image, tags } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    post.tags = tags || post.tags;

    const updatedPost = await post.save();
    const populatedPost = await populatePost(updatedPost._id);

    // Emit update to clients in this post's room
    req.app.get("io").to(req.params.id).emit("postUpdated", populatedPost);

    res.json(populatedPost);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    // Emit deletion to all clients
    req.app.get("io").emit("postDeleted", req.params.id);

    res.json({ message: "Post removed" });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
// In your likePost controller
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({ user: req.user._id });
    }

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id)
      .populate("likes.user", "name avatar")
      .populate("author", "name avatar");

    // Emit to all clients in this post's room
    req.app.get("io").to(req.params.id).emit("postUpdated", populatedPost);

    res.json(populatedPost.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
    };

    post.comments.push(comment);
    const updatedPost = await post.save();
    const populatedPost = await populatePost(updatedPost._id);

    // Emit update to clients in this post's room
    req.app.get("io").to(req.params.id).emit("postUpdated", populatedPost);

    res.json(populatedPost.comments);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment from a post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId
    );

    const updatedPost = await post.save();
    const populatedPost = await populatePost(updatedPost._id);

    // Emit update to clients in this post's room
    req.app.get("io").to(req.params.id).emit("postUpdated", populatedPost);

    res.json({ message: "Comment removed" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
};
