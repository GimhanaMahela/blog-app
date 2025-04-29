import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import postService from "../services/postService";
import { toast } from "react-toastify";

const SinglePostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (error) {
        toast.error("Failed to fetch post");
        navigate("/posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to like posts");
      return;
    }

    try {
      const updatedPost = await postService.likePost(post._id);
      setPost(updatedPost);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const updatedPost = await postService.addComment(post._id, comment);
      setPost(updatedPost);
      setComment("");
      toast.success("Comment added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const updatedPost = await postService.deleteComment(post._id, commentId);
      setPost(updatedPost);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(post._id);
        toast.success("Post deleted");
        navigate("/posts");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete post");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  const isAuthor = isAuthenticated && user._id === post.author._id;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/posts/edit/${post._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4">
          Posted by {post.author.name} on{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <div className="prose max-w-none mb-6">
          <p>{post.content}</p>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              isAuthenticated && post.likes.includes(user._id)
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            <span>Like</span>
            <span>({post.likes.length})</span>
          </button>
        </div>
      </article>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Comments ({post.comments.length})
        </h2>

        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow px-3 py-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </div>
          </form>
        )}

        {post.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment.author.name}</p>
                    <p className="text-gray-600 text-sm mb-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>{comment.text}</p>
                  </div>
                  {isAuthenticated &&
                    (user._id === comment.author._id || isAuthor) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link
        to="/posts"
        className="inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        Back to Posts
      </Link>
    </div>
  );
};

export default SinglePostPage;
