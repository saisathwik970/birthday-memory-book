import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(null);
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("bmb_volume");
    return saved ? Number(saved) : 0.5;
  });
  const [muted, setMuted] = useState(() => localStorage.getItem("bmb_muted") === "true");
  const [src, setSrc] = useState("");

  // Load the admin-configured background track as soon as the user is logged in,
  // instead of only when the Final Surprise page happens to set one.
  useEffect(() => {
    if (!user) return;
    api
      .get("/settings")
      .then(({ data }) => {
        if (data.musicUrl) setSrc(data.musicUrl);
      })
      .catch(() => {
        /* no settings yet, or not reachable — leave src empty */
      });
  }, [user]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
    localStorage.setItem("bmb_volume", String(volume));
    localStorage.setItem("bmb_muted", String(muted));
  }, [volume, muted]);

  const play = () => {
    audioRef.current?.play().catch(() => {});
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const toggle = () => (isPlaying ? pause() : play());

  const changeTrack = (newSrc) => {
    setSrc(newSrc);
  };

  return (
    <MusicContext.Provider
      value={{ isPlaying, play, pause, toggle, volume, setVolume, muted, setMuted, src, changeTrack }}
    >
      <audio ref={audioRef} src={src} loop />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);