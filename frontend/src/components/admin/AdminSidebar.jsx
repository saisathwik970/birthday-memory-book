import React from "react";
import {
  FiGrid,
  FiImage,
  FiVideo,
  FiBookOpen,
  FiClock,
  FiMessageCircle,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

export const TABS = [
  { id: "overview", label: "Dashboard", icon: FiGrid },
  { id: "gallery", label: "Gallery", icon: FiImage },
  { id: "videos", label: "Videos", icon: FiVideo },
  { id: "pages", label: "Pages", icon: FiBookOpen },
  { id: "timeline", label: "Timeline", icon: FiClock },
  { id: "messages", label: "Messages", icon: FiMessageCircle },
  { id: "members", label: "Members", icon: FiUsers },
  { id: "settings", label: "Settings", icon: FiSettings },
];

const AdminSidebar = ({ active, onChange }) => {
  return (
    <aside className="w-full md:w-56 shrink-0">
      <div className="glass rounded-2xl p-3 md:sticky md:top-28 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-bmb-pink to-bmb-purple text-white shadow-glow"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;
