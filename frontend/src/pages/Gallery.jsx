import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiX, FiChevronLeft, FiChevronRight, FiPlay, FiPause } from "react-icons/fi";
import api from "../api/axios.js";
import CelebrationBackground from "../components/CelebrationBackground.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [slideshow, setSlideshow] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/gallery")
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setSlideshow(false);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, next, prev, closeLightbox]);

  // Slideshow autoplay
  useEffect(() => {
    if (!slideshow) return;
    const id = setInterval(next, 2500);
    return () => clearInterval(id);
  }, [slideshow, next]);

  const toggleFavorite = async (id) => {
    try {
      const { data } = await api.post(`/gallery/${id}/favorite`);
      setItems((prev) => prev.map((it) => (it._id === id ? data : it)));
    } catch {
      /* no-op: requires login */
    }
  };

  const isFavorited = (item) => user && item.favoritedBy?.includes(user.id);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <CelebrationBackground />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="font-display text-4xl text-center text-shimmer mb-10">Photo Gallery</h1>

        {loading && <p className="text-center text-white/50">Loading photos...</p>}
        {!loading && items.length === 0 && (
          <p className="text-center text-white/50">
            No photos yet — the admin can upload from the dashboard.
          </p>
        )}

        {/* Masonry via CSS columns */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:balance]">
          {items.map((item, idx) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setActiveIndex(idx)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-sm font-medium">{item.title}</p>
                {item.caption && <p className="text-xs text-white/70">{item.caption}</p>}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item._id);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <FiHeart className={isFavorited(item) ? "text-bmb-pink fill-bmb-pink" : "text-white"} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && items[activeIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-2xl">
              <FiX />
            </button>
            <button onClick={prev} className="absolute left-4 text-white text-3xl">
              <FiChevronLeft />
            </button>
            <button onClick={next} className="absolute right-4 text-white text-3xl">
              <FiChevronRight />
            </button>

            <motion.img
              key={items[activeIndex]._id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={items[activeIndex].imageUrl}
              alt={items[activeIndex].title}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-glow"
            />

            <div className="absolute bottom-6 flex items-center gap-4 glass px-5 py-2 rounded-full">
              <p className="text-sm text-white/80">{items[activeIndex].title}</p>
              <button onClick={() => setSlideshow((s) => !s)} className="text-bmb-gold">
                {slideshow ? <FiPause /> : <FiPlay />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
