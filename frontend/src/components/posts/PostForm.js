import { useState } from "react";

const PostForm = ({
  initialData = { title: "", content: "" },
  onSubmit,
  isLoading,
}) => {
  const [postData, setPostData] = useState(initialData);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={postData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-1">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={postData.content}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded min-h-[200px]"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
};

export default PostForm;
