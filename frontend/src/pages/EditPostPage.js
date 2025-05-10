import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postService from "../services/postService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const EditPostPage = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await postService.getPostById(id);

        if (post.author._id !== user?._id) {
          toast.error("You are not authorized to edit this post");
          navigate("/posts");
          return;
        }

        setPostData({
          title: post.title,
          content: post.content,
        });
      } catch (error) {
        toast.error("Failed to fetch post");
        navigate("/posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedPost = await postService.updatePost(id, postData);

      setPostData({
        title: updatedPost.title,
        content: updatedPost.content,
      });

      toast.success("Post updated successfully!");
      navigate(`/posts`); // ✅ Go to the updated post's detail page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
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
            onClick={() => navigate(`/posts/${id}`)}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => navigate(`/posts/${id}`)}  
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
