import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import CelebrationBackground from "../components/CelebrationBackground.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const EMOJIS = ["🎉", "❤️", "🥳", "🎂", "✨", "🌸"];

const Wishes = () => {
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const load = () => {
    api
      .get("/guestbook")
      .then(({ data }) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/guestbook", { message, emoji });
      setEntries((prev) => [{ ...data, author: { name: user.name } }, ...prev]);
      setMessage("");
      toast.success("Wish added! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post wish");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHeart = async (id) => {
    try {
      const { data } = await api.post(`/guestbook/${id}/heart`);
      setEntries((prev) => prev.map((e) => (e._id === id ? { ...e, ...data } : e)));
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <CelebrationBackground />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-center text-shimmer mb-10">
          Birthday Wishes Wall
        </h1>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 mb-10">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Leave a birthday wish..."
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bmb-pink resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`text-xl transition-transform ${
                    emoji === em ? "scale-125" : "opacity-60 hover:scale-110"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-bmb-pink to-bmb-purple font-medium shadow-glow disabled:opacity-60"
            >
              <FiSend /> Post
            </motion.button>
          </div>
        </form>

        {loading && <p className="text-center text-white/50">Loading wishes...</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-bmb-gold">{entry.name || entry.author?.name}</p>
                  <span className="text-xl">{entry.emoji}</span>
                </div>
                <p className="text-white/80 text-sm">{entry.message}</p>
                <button
                  onClick={() => toggleHeart(entry._id)}
                  className="flex items-center gap-1 mt-3 text-sm text-white/60 hover:text-bmb-pink transition-colors"
                >
                  <FiHeart className={entry.heartedBy?.includes(user?.id) ? "fill-bmb-pink text-bmb-pink" : ""} />
                  {entry.hearts || 0}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishes;
