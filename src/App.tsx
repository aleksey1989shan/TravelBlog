import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import Header from "./components/Header/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import PostPage from "./pages/PostPage/PostPage";
import AddReviewPage from "./pages/AddReviewPage/AddReviewPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage";
import Game from "./pages/Game/Game";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/posts/:id/review" element={<AddReviewPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

//228262435097-92qmglchc00eq701euvn9v9tjqc028dv.apps.googleusercontent.com
