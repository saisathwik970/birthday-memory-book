import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FiUser, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import CelebrationBackground from "../components/CelebrationBackground.jsx";
import Confetti from "../components/Confetti.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      setSuccess(true);
      toast.success("Welcome back! 🎉");
      setTimeout(() => navigate("/"), 1400);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CelebrationBackground density="high" />
      <Confetti trigger={success} />

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-[90%] max-w-md glass rounded-3xl p-8 shadow-glow"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🎂</div>
              <h1 className="font-display text-3xl font-bold text-shimmer">Happy Birthday</h1>
              <p className="text-white/60 text-sm mt-1">Sign in to open the memory book</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-11 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bmb-pink transition"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-11 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bmb-pink transition"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-bmb-pink via-bmb-purple to-bmb-gold font-semibold shadow-glow-gold disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </motion.button>
            </form>

            <p className="text-center text-white/50 text-xs mt-6">
              New here?{" "}
              <Link to="/register" className="text-bmb-gold hover:underline">
                Request an invite
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-7xl"
            >
              🎉
            </motion.div>
            <h2 className="font-display text-2xl mt-4 text-shimmer">Opening your memories...</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
