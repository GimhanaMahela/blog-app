import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postService from "../services/postService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const CreatePostPage = () => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting to create post"); 
      await postService.createPost(postData);
      toast.success("Post created successfully!");
      console.log("Post created successfully"); 
      window.location.href = "/posts";
    } catch (error) {
      console.error("Creation error:", error); // Detailed error
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-xl mb-4">You need to login to create posts</p>
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={postData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg min-h-[200px]"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
