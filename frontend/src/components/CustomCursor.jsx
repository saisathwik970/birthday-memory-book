import React, { useEffect, useRef } from "react";

/**
 * Custom glowing cursor with a short sparkle trail.
 * Disabled automatically on touch devices.
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const trailRef = useRef([]);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const move = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      // Occasionally spawn a sparkle
      if (Math.random() > 0.8) {
        const sparkle = document.createElement("div");
        sparkle.className = "cursor-dot";
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        sparkle.style.width = "5px";
        sparkle.style.height = "5px";
        sparkle.style.opacity = "0.7";
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 500);
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (window.matchMedia("(pointer: coarse)").matches) return null;

  return <div ref={dotRef} className="cursor-dot" />;
};

export default CustomCursor;
