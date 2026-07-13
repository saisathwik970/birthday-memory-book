import React, { useEffect, useState } from "react";
import { FiUsers, FiImage, FiVideo, FiMessageCircle, FiClock } from "react-icons/fi";
import api from "../../api/axios.js";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
      style={{ background: `${color}25`, color }}
    >
      <Icon />
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-white/50 text-sm">{label}</p>
    </div>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/members/stats/overview")
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Dashboard Overview</h2>
      {!stats ? (
        <p className="text-white/50">Loading stats...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={FiUsers} label="Approved members" value={stats.totalMembers} color="#ec4899" />
          <StatCard icon={FiClock} label="Pending approvals" value={stats.pendingMembers} color="#fbbf24" />
          <StatCard icon={FiImage} label="Photos" value={stats.totalPhotos} color="#3b82f6" />
          <StatCard icon={FiVideo} label="Videos" value={stats.totalVideos} color="#7c3aed" />
          <StatCard icon={FiMessageCircle} label="Guestbook wishes" value={stats.totalWishes} color="#34d399" />
        </div>
      )}

      <div className="glass rounded-2xl p-5 mt-6 text-white/60 text-sm">
        Use the sidebar to upload photos and videos, build the timeline and memory-book pages,
        moderate guestbook messages, approve new members, and edit site-wide settings like the
        final surprise message and background music.
      </div>
    </div>
  );
};

export default AdminOverview;
