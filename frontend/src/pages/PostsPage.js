import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import postService from "../services/postService";
import { toast } from "react-toastify";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Posts</h1>
        {isAuthenticated && (
          <Link
            to="/posts/create"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl">No posts found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">
                <Link to={`/posts/${post._id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">
                Posted by {post.author.name} on{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-4">{post.content.substring(0, 200)}...</p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <span className="text-gray-500">
                    {post.likes.length} likes
                  </span>
                  <span className="text-gray-500">
                    {post.comments.length} comments
                  </span>
                </div>
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;
