import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import api from "../api/axios.js";
import CelebrationBackground from "../components/CelebrationBackground.jsx";

const VideoCard = ({ item }) => {
  const videoRef = useRef(null);

  const handleEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden group"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="relative aspect-video bg-black/40">
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.thumbnail || undefined}
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <FiPlay className="text-4xl text-white/80" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{item.title}</h3>
        {item.caption && <p className="text-sm text-white/60 mt-1">{item.caption}</p>}
      </div>
    </motion.div>
  );
};

const Videos = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenItem, setFullscreenItem] = useState(null);

  useEffect(() => {
    api
      .get("/videos")
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <CelebrationBackground />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="font-display text-4xl text-center text-shimmer mb-10">Video Gallery</h1>

        {loading && <p className="text-center text-white/50">Loading videos...</p>}
        {!loading && items.length === 0 && (
          <p className="text-center text-white/50">
            No videos yet — the admin can upload from the dashboard.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} onClick={() => setFullscreenItem(item)} className="cursor-pointer">
              <VideoCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {fullscreenItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
          onClick={() => setFullscreenItem(null)}
        >
          <video
            src={fullscreenItem.videoUrl}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Videos;
