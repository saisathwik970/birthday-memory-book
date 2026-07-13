import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiSave } from "react-icons/fi";
import api from "../../api/axios.js";

const AdminSettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/settings")
      .then(({ data }) => setSettings(data))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/settings", settings);
      setSettings(data);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/50">Loading settings...</p>;
  if (!settings) return <p className="text-white/50">Could not load settings.</p>;

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Site Settings</h2>
      <form onSubmit={handleSave} className="glass rounded-2xl p-5 space-y-4 max-w-2xl">
        <div>
          <label className="text-sm text-white/60 block mb-1">Hero title</label>
          <input
            value={settings.siteTitle}
            onChange={(e) => handleChange("siteTitle", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 block mb-1">Hero subtitle</label>
          <input
            value={settings.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 block mb-1">Background music URL (Cloudinary)</label>
          <input
            value={settings.musicUrl}
            onChange={(e) => handleChange("musicUrl", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 block mb-1">Final surprise video URL</label>
          <input
            value={settings.finalVideoUrl}
            onChange={(e) => handleChange("finalVideoUrl", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 block mb-1">Final surprise message</label>
          <textarea
            rows={3}
            value={settings.finalMessage}
            onChange={(e) => handleChange("finalMessage", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 resize-none"
          />
        </div>
        <div>
          <label className="text-sm text-white/60 block mb-1">
            Final collage photo URLs (comma separated)
          </label>
          <textarea
            rows={2}
            value={(settings.finalPhotos || []).join(", ")}
            onChange={(e) =>
              handleChange(
                "finalPhotos",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-bmb-pink to-bmb-purple font-medium disabled:opacity-60"
        >
          <FiSave /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsManager;
