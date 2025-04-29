const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} = require("../controllers/posts.controller");
const { protect } = require("../middlewares/auth.middleware");

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get("/", getPosts);

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", getPostById);

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  protect,
  [
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty(),
  ],
  createPost
);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  "/:id",
  protect,
  [
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty(),
  ],
  updatePost
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", protect, deletePost);

// @route   PUT /api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put("/:id/like", protect, likePost);

// @route   POST /api/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.post(
  "/:id/comments",
  protect,
  [check("text", "Text is required").not().isEmpty()],
  addComment
);

// @route   DELETE /api/posts/:id/comments/:commentId
// @desc    Delete comment from a post
// @access  Private
router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;
