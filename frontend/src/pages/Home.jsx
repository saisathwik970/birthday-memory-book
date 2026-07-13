import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CelebrationBackground from "../components/CelebrationBackground.jsx";
import Confetti from "../components/Confetti.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Home = () => {
  const { user } = useAuth();
  const [candleLit, setCandleLit] = useState(true);
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [giftOpen, setGiftOpen] = useState(false);
  const [confettiTick, setConfettiTick] = useState(0);
  const [settings, setSettings] = useState({
    siteTitle: "Happy Birthday ❤️",
    subtitle: "Every memory tells a story.",
  });

  useEffect(() => {
    api
      .get("/settings")
      .then(({ data }) => setSettings(data))
      .catch(() => {
        /* fall back to defaults above if settings can't be fetched */
      });
  }, []);

  const totalCandles = 5;

  const blowCandle = () => {
    if (candlesBlown < totalCandles) {
      const next = candlesBlown + 1;
      setCandlesBlown(next);
      if (next === totalCandles) {
        setCandleLit(false);
        setConfettiTick((t) => t + 1);
      }
    }
  };

  const openGift = () => {
    setGiftOpen(true);
    setConfettiTick((t) => t + 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CelebrationBackground density="high" />
      <Confetti trigger={confettiTick} />

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="uppercase tracking-[0.3em] text-bmb-gold text-xs mb-4"
        >
          {user ? `Welcome, ${user.name}` : "A private celebration"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl font-extrabold text-shimmer leading-tight"
        >
          {settings.siteTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-4 text-white/70 text-lg md:text-xl font-light italic"
        >
          {settings.subtitle}
        </motion.p>

        {/* Cake & candles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-14 flex flex-col items-center"
        >
          <div className="flex gap-2 mb-2">
            {Array.from({ length: totalCandles }).map((_, i) => (
              <button
                key={i}
                onClick={blowCandle}
                className="relative flex flex-col items-center group"
                aria-label="Blow out candle"
              >
                {i >= candlesBlown && (
                  <motion.div
                    animate={{ opacity: [1, 0.6, 1], scaleY: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-2 h-3 rounded-full bg-gradient-to-t from-orange-500 to-yellow-200 mb-[-2px] group-hover:scale-125 transition-transform"
                  />
                )}
                {i < candlesBlown && (
                  <div className="w-1 h-2 mb-[-2px] opacity-40">
                    <div className="w-full h-full bg-white/30 rounded-full blur-[2px]" />
                  </div>
                )}
                <div className="w-2 h-8 bg-gradient-to-b from-white to-bmb-pink/60 rounded-sm" />
              </button>
            ))}
          </div>
          <div className="w-56 h-16 bg-gradient-to-b from-bmb-pink to-bmb-purple rounded-t-full relative shadow-glow">
            <div className="absolute inset-x-0 top-0 h-3 bg-white/20 rounded-t-full" />
          </div>
          <div className="w-64 h-10 bg-gradient-to-b from-bmb-purple to-bmb-dark rounded-b-2xl -mt-1" />
          <p className="text-white/50 text-xs mt-3">
            {candleLit ? "Click each candle to blow it out" : "🎉 Wish made!"}
          </p>
        </motion.div>
      </section>

      {/* Gift box surprise */}
      <section className="relative z-10 flex flex-col items-center justify-center py-24 px-6 text-center">
        <h2 className="font-display text-3xl text-shimmer mb-6">A little something for you</h2>

        {!giftOpen ? (
          <motion.button
            onClick={openGift}
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            whileTap={{ scale: 0.95 }}
            className="text-8xl"
            aria-label="Open gift"
          >
            🎁
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass rounded-3xl p-8 max-w-md shadow-glow-gold"
          >
            <div className="text-6xl mb-4">💌</div>
            <p className="text-white/90 font-display text-xl italic">
              "Wishing you a day as bright and beautiful as the memories on these pages."
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;