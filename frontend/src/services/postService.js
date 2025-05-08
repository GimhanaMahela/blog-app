import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

const getAllPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createPost = async (postData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updatePost = async (id, postData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${id}`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deletePost = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const likePost = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_URL}/${id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const addComment = async (id, comment) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_URL}/${id}/comments`,
    { text: comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `${API_URL}/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const postService = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
};

export default postService;
