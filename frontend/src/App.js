import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import EditPostPage from "./pages/EditPostPage";
import SinglePostPage from "./pages/SinglePostPage";
import PostsPage from "./pages/PostsPage";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import CreatePostPage from "./pages/CreatePostPage";

function App() {
  return (
    <>
      <AuthProvider>
          <Routes>
            <Route
              path="/test"
              element={
                <div
                  style={{
                    backgroundColor: "red",
                    padding: "20px",
                    color: "white",
                  }}
                >
                  <h1>RAW HTML TEST</h1>
                  <p>If you see this, React is working</p>
                </div>
              }
            />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="posts/create" element={<CreatePostPage />} />
                <Route path="posts/edit/:id" element={<EditPostPage />} />
              </Route>

              {/* Public routes that can be nested under protected if needed */}
              <Route path="posts" element={<PostsPage />} />
              <Route path="posts/:id" element={<SinglePostPage />} />
            </Route>
          </Routes>
          <ToastContainer />
        
      </AuthProvider>
    </>
  );
}

export default App;
