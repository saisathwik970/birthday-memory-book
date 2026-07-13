import React from "react";
import { motion } from "framer-motion";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useMusic } from "../context/MusicContext.jsx";

const MusicPlayer = () => {
  const { isPlaying, toggle, volume, setVolume, muted, setMuted } = useMusic();

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed bottom-6 right-6 z-50 glass rounded-full px-4 py-3 flex items-center gap-3 shadow-glow-gold"
    >
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-bmb-pink to-bmb-purple flex items-center justify-center text-white"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <FiPause /> : <FiPlay />}
      </button>

      {/* Mini equalizer bars, animate only while playing */}
      <div className="hidden sm:flex items-end gap-[3px] h-5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`w-[3px] bg-bmb-gold rounded-full ${isPlaying ? "animate-pulse" : ""}`}
            style={{ height: isPlaying ? `${6 + i * 3}px` : "4px", transition: "height 0.3s" }}
          />
        ))}
      </div>

      <button onClick={() => setMuted(!muted)} className="text-white/80 hover:text-white">
        {muted ? <FiVolumeX /> : <FiVolume2 />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-16 accent-bmb-pink hidden sm:block"
      />
    </motion.div>
  );
};

export default MusicPlayer;
