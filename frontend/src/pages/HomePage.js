import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to MERN Blog</h1>
      <p className="text-xl mb-8">
        A full-stack blog application built with MongoDB, Express, React, and
        Node.js
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/posts"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          Browse Posts
        </Link>

        {!isAuthenticated && (
          <Link
            to="/register"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          >
            Join Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
