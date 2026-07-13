import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/timeline", label: "Timeline" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/memory-book", label: "Book" },
  { to: "/wishes", label: "Guestbook" },
  { to: "/surprise", label: "Surprise" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-50"
      >
        <div className="glass px-4 sm:px-8 py-4 flex items-center justify-between shadow-glow rounded-none border-x-0 border-t-0">
          <Link to="/" className="font-display text-lg font-bold text-shimmer whitespace-nowrap shrink-0">
            🎂 Memory Book
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-5 overflow-x-auto scrollbar-none">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs lg:text-sm text-white/80 hover:text-bmb-gold transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm text-bmb-gold hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                <FiSettings /> Admin
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-white/70 hover:text-bmb-pink transition-colors shrink-0"
              >
                <FiLogOut />
              </button>
            )}
          </div>

          <button className="md:hidden text-2xl shrink-0" onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[64px] left-0 w-full z-40 glass rounded-none overflow-hidden max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col p-4 gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-bmb-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-bmb-gold">
                  Admin Dashboard
                </Link>
              )}
              {user && (
                <button onClick={handleLogout} className="text-left text-bmb-pink">
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;