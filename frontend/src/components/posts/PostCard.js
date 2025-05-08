import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const isAuthor = user && user._id === post.author._id;

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-2">
        <Link to={`/posts/${post._id}`} className="hover:text-blue-600">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600 mb-3">{post.content.substring(0, 100)}...</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          By {post.author.name} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        {isAuthor && (
          <div className="space-x-2">
            <Link
              to={`/posts/edit/${post._id}`}
              className="text-blue-500 hover:underline text-sm"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
