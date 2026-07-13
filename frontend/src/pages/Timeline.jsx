import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import CelebrationBackground from "../components/CelebrationBackground.jsx";

const Timeline = () => {
  const [entries, setEntries] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/timeline")
      .then(({ data }) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <CelebrationBackground />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-center text-shimmer mb-14">Our Timeline</h1>

        {loading && <p className="text-center text-white/50">Loading memories...</p>}

        {!loading && entries.length === 0 && (
          <p className="text-center text-white/50">
            No timeline entries yet — the admin can add years from the dashboard.
          </p>
        )}

        <div className="relative border-l-2 border-bmb-purple/40 ml-4">
          {entries.map((entry, i) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative pl-8 pb-10"
            >
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-bmb-pink to-bmb-gold shadow-glow-gold" />

              <button
                onClick={() => setOpenId(openId === entry._id ? null : entry._id)}
                className="w-full text-left glass rounded-2xl p-5 hover:shadow-glow transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-bmb-gold">{entry.year}</h3>
                  <span className="text-white/40 text-sm">
                    {openId === entry._id ? "Close" : "Open"}
                  </span>
                </div>
                {entry.title && <p className="text-white/70 mt-1">{entry.title}</p>}
              </button>

              <AnimatePresence>
                {openId === entry._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass rounded-2xl p-5 mt-3">
                      {entry.description && (
                        <p className="text-white/80 mb-4">{entry.description}</p>
                      )}
                      {entry.photos?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                          {entry.photos.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`${entry.year} memory ${idx + 1}`}
                              className="rounded-xl object-cover h-28 w-full"
                            />
                          ))}
                        </div>
                      )}
                      {entry.videos?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {entry.videos.map((url, idx) => (
                            <video key={idx} src={url} controls className="rounded-xl w-full" />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
