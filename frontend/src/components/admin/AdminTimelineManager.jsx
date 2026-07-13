import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus } from "react-icons/fi";
import api from "../../api/axios.js";

const emptyForm = { year: "", title: "", description: "" };

const AdminTimelineManager = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .get("/timeline")
      .then(({ data }) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.year.trim()) return toast.error("Year is required");
    setSaving(true);
    try {
      const { data } = await api.post("/timeline", form);
      setEntries((prev) => [...prev, data]);
      setForm(emptyForm);
      toast.success("Timeline entry added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this timeline entry?")) return;
    try {
      await api.delete(`/timeline/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Timeline Manager</h2>

      <form onSubmit={handleCreate} className="glass rounded-2xl p-5 mb-8 grid sm:grid-cols-3 gap-3">
        <input
          placeholder="Year (e.g. 2021)"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Short title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Story / description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-bmb-pink to-bmb-purple font-medium disabled:opacity-60"
        >
          <FiPlus /> {saving ? "Adding..." : "Add Timeline Entry"}
        </button>
        <p className="sm:col-span-3 text-xs text-white/40">
          Photos and videos for each year can be attached via the API's `photos` / `videos` array
          fields (Cloudinary URLs) — extend this form with an uploader the same way Gallery does.
        </p>
      </form>

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry._id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-bmb-gold">{entry.year}</p>
                <p className="text-sm text-white/70">{entry.title}</p>
              </div>
              <button onClick={() => handleDelete(entry._id)} className="text-white/60 hover:text-red-400">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTimelineManager;
