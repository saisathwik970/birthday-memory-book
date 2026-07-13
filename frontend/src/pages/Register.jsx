import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import CelebrationBackground from "../components/CelebrationBackground.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form.name, form.username, form.password);
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CelebrationBackground />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-[90%] max-w-md glass rounded-3xl p-8 shadow-glow"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎁</div>
          <h1 className="font-display text-3xl font-bold text-shimmer">Request an Invite</h1>
          <p className="text-white/60 text-sm mt-1">
            An admin will review and approve your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            required
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bmb-pink"
          />
          <input
            name="username"
            required
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bmb-pink"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Choose a password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bmb-pink"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-bmb-pink via-bmb-purple to-bmb-gold font-semibold shadow-glow-gold disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Request Access"}
          </motion.button>
        </form>

        <p className="text-center text-white/50 text-xs mt-6">
          Already approved?{" "}
          <Link to="/login" className="text-bmb-gold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
