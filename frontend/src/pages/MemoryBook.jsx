import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../api/axios.js";
import CelebrationBackground from "../components/CelebrationBackground.jsx";

const STICKERS = { star: "⭐", heart: "💕", flower: "🌸", none: "" };

const MemoryBook = () => {
  const [pages, setPages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/memory-pages")
      .then(({ data }) => setPages(data))
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  }, []);

  const goNext = () => {
    if (current < pages.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  };
  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const page = pages[current];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      <CelebrationBackground />

      <h1 className="relative z-10 font-display text-4xl text-center text-shimmer mb-10">
        Memory Book
      </h1>

      {loading && <p className="relative z-10 text-white/50">Loading pages...</p>}

      {!loading && pages.length === 0 && (
        <p className="relative z-10 text-white/50">
          No pages yet — the admin can add scrapbook pages from the dashboard.
        </p>
      )}

      {!loading && pages.length > 0 && (
        <div className="relative z-10 w-full max-w-2xl">
          <div className="relative aspect-[4/5] [perspective:1600px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page._id}
                custom={direction}
                initial={{ rotateY: direction > 0 ? 90 : -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: direction > 0 ? -90 : 90, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="book-page absolute inset-0 glass rounded-3xl p-6 flex flex-col shadow-glow overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.1), rgba(124,58,237,0.15))",
                }}
              >
                {/* Decorative tape */}
                {page.decoration === "tape" && (
                  <>
                    <div className="absolute -top-2 left-8 w-16 h-6 bg-bmb-gold/40 rotate-[-6deg] rounded-sm" />
                    <div className="absolute -top-2 right-8 w-16 h-6 bg-bmb-pink/40 rotate-[6deg] rounded-sm" />
                  </>
                )}
                {page.decoration === "flowers" && (
                  <div className="absolute top-2 right-4 text-3xl">🌸</div>
                )}

                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  {page.photoUrl && (
                    <img
                      src={page.photoUrl}
                      alt={page.caption || "memory"}
                      className="rounded-2xl max-h-[55%] object-cover shadow-lg"
                    />
                  )}
                  {page.videoUrl && (
                    <video src={page.videoUrl} controls className="rounded-2xl max-h-[55%]" />
                  )}
                  {page.caption && (
                    <p className="font-display italic text-lg text-center text-white/90">
                      {page.caption}
                    </p>
                  )}
                  {page.date && <p className="text-xs text-bmb-gold">{page.date}</p>}
                  {page.sticker && STICKERS[page.sticker] && (
                    <span className="text-3xl">{STICKERS[page.sticker]}</span>
                  )}
                </div>

                <p className="text-center text-white/30 text-xs mt-2">
                  Page {current + 1} of {pages.length}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="glass px-4 py-2 rounded-full flex items-center gap-1 disabled:opacity-30"
            >
              <FiChevronLeft /> Prev
            </button>
            <button
              onClick={goNext}
              disabled={current === pages.length - 1}
              className="glass px-4 py-2 rounded-full flex items-center gap-1 disabled:opacity-30"
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryBook;
