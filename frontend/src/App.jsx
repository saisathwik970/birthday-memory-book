import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Timeline from "./pages/Timeline.jsx";
import Gallery from "./pages/Gallery.jsx";
import Videos from "./pages/Videos.jsx";
import MemoryBook from "./pages/MemoryBook.jsx";
import Wishes from "./pages/Wishes.jsx";
import FinalSurprise from "./pages/FinalSurprise.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <CustomCursor />
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <MusicPlayer />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <Timeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <Videos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memory-book"
            element={
              <ProtectedRoute>
                <MemoryBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishes"
            element={
              <ProtectedRoute>
                <Wishes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surprise"
            element={
              <ProtectedRoute>
                <FinalSurprise />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
