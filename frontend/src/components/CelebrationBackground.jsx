import React, { useMemo } from "react";
import { motion } from "framer-motion";

const BALLOON_COLORS = ["#ec4899", "#7c3aed", "#fbbf24", "#3b82f6", "#f472b6"];

/**
 * Ambient animated background: gradient + twinkling stars + floating balloons + fireflies.
 * Pure CSS/SVG/Framer Motion — no external assets required.
 */
const CelebrationBackground = ({ density = "normal" }) => {
  const balloonCount = density === "high" ? 10 : 6;
  const starCount = density === "high" ? 60 : 35;

  const balloons = useMemo(
    () =>
      Array.from({ length: balloonCount }, (_, i) => ({
        id: i,
        left: `${(i * 97) % 100}%`,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        delay: (i % 5) * 1.2,
        duration: 8 + (i % 4) * 2,
        scale: 0.6 + ((i * 13) % 5) / 10,
      })),
    [balloonCount]
  );

  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        id: i,
        top: `${(i * 53) % 100}%`,
        left: `${(i * 71) % 100}%`,
        size: 1 + ((i * 7) % 3),
        delay: (i % 6) * 0.5,
      })),
    [starCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-birthday-gradient" />

      {/* Twinkling stars */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Floating balloons */}
      {balloons.map((b) => (
        <motion.div
          key={`balloon-${b.id}`}
          className="absolute bottom-[-120px]"
          style={{ left: b.left }}
          animate={{ y: ["0vh", "-120vh"] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={40 * b.scale}
            height={55 * b.scale}
            viewBox="0 0 40 55"
            style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))" }}
          >
            <ellipse cx="20" cy="20" rx="18" ry="20" fill={b.color} opacity="0.85" />
            <path d="M20 40 L20 55" stroke="#ffffff55" strokeWidth="1" />
            <polygon points="16,40 24,40 20,46" fill={b.color} opacity="0.85" />
          </svg>
        </motion.div>
      ))}

      {/* Soft glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-bmb-pink/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-bmb-purple/30 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-bmb-gold/20 rounded-full blur-3xl animate-float-slow" />
    </div>
  );
};

export default CelebrationBackground;
