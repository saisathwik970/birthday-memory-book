import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import CelebrationBackground from "../components/CelebrationBackground.jsx";
import Confetti from "../components/Confetti.jsx";
import { useMusic } from "../context/MusicContext.jsx";

const FinalSurprise = () => {
  const [settings, setSettings] = useState(null);
  const [opened, setOpened] = useState(false);
  const { changeTrack, play } = useMusic();

  useEffect(() => {
    api
      .get("/settings")
      .then(({ data }) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  const handleOpen = () => {
    setOpened(true);
    if (settings?.musicUrl) {
      changeTrack(settings.musicUrl);
      setTimeout(play, 300);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <CelebrationBackground density="high" />
      <Confetti trigger={opened} pieceCount={250} duration={5000} />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="relative z-10 text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl text-shimmer mb-10">
              One Last Surprise Awaits
            </h1>
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.1, rotate: [0, -4, 4, 0] }}
              whileTap={{ scale: 0.9 }}
              className="text-9xl"
            >
              🎁
            </motion.button>
            <p className="text-white/60 mt-6">Open Your Birthday Surprise</p>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 max-w-2xl w-full text-center space-y-8"
          >
            {settings?.finalVideoUrl && (
              <video
                src={settings.finalVideoUrl}
                controls
                autoPlay
                className="w-full rounded-3xl shadow-glow"
              />
            )}

            <div className="glass rounded-3xl p-8 shadow-glow-gold">
              <p className="font-display text-2xl italic leading-relaxed text-shimmer">
                {settings?.finalMessage ||
                  "Every candle, every page, every memory — all of it was for you. Happy Birthday!"}
              </p>
            </div>

            {settings?.finalPhotos?.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {settings.finalPhotos.map((url, idx) => (
                  <motion.img
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    src={url}
                    alt={`Collage ${idx + 1}`}
                    className="rounded-xl object-cover aspect-square"
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center gap-3 text-3xl">
              {["🎉", "💖", "🎈", "✨", "🥳"].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalSurprise;
