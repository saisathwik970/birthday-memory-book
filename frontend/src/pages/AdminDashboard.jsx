import React, { useState } from "react";
import CelebrationBackground from "../components/CelebrationBackground.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminOverview from "../components/admin/AdminOverview.jsx";
import AdminGalleryManager from "../components/admin/AdminGalleryManager.jsx";
import AdminVideoManager from "../components/admin/AdminVideoManager.jsx";
import AdminPagesManager from "../components/admin/AdminPagesManager.jsx";
import AdminTimelineManager from "../components/admin/AdminTimelineManager.jsx";
import AdminMessagesManager from "../components/admin/AdminMessagesManager.jsx";
import AdminMembersManager from "../components/admin/AdminMembersManager.jsx";
import AdminSettingsManager from "../components/admin/AdminSettingsManager.jsx";

const VIEWS = {
  overview: AdminOverview,
  gallery: AdminGalleryManager,
  videos: AdminVideoManager,
  pages: AdminPagesManager,
  timeline: AdminTimelineManager,
  messages: AdminMessagesManager,
  members: AdminMembersManager,
  settings: AdminSettingsManager,
};

const AdminDashboard = () => {
  const [active, setActive] = useState("overview");
  const ActiveView = VIEWS[active];

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8">
      <CelebrationBackground />
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <AdminSidebar active={active} onChange={setActive} />
        <main className="flex-1 glass rounded-3xl p-6 min-h-[60vh]">
          <ActiveView />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
