import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus } from "react-icons/fi";
import api from "../../api/axios.js";

const emptyForm = {
  pageNumber: "",
  photoUrl: "",
  caption: "",
  date: "",
  sticker: "none",
  decoration: "tape",
};

const AdminPagesManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .get("/memory-pages")
      .then(({ data }) => setPages(data))
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.pageNumber) return toast.error("Page number is required");
    setSaving(true);
    try {
      const { data } = await api.post("/memory-pages", {
        ...form,
        pageNumber: Number(form.pageNumber),
      });
      setPages((prev) => [...prev, data].sort((a, b) => a.pageNumber - b.pageNumber));
      setForm(emptyForm);
      toast.success("Page added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this page?")) return;
    try {
      await api.delete(`/memory-pages/${id}`);
      setPages((prev) => prev.filter((p) => p._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Memory Book Pages</h2>

      <form onSubmit={handleCreate} className="glass rounded-2xl p-5 mb-8 grid sm:grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Page number"
          value={form.pageNumber}
          onChange={(e) => setForm({ ...form, pageNumber: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Photo URL (Cloudinary)"
          value={form.photoUrl}
          onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Caption"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Date (e.g. June 2021)"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <select
          value={form.sticker}
          onChange={(e) => setForm({ ...form, sticker: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        >
          <option value="none">No sticker</option>
          <option value="star">⭐ Star</option>
          <option value="heart">💕 Heart</option>
          <option value="flower">🌸 Flower</option>
        </select>
        <select
          value={form.decoration}
          onChange={(e) => setForm({ ...form, decoration: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        >
          <option value="tape">Decorative tape</option>
          <option value="flowers">Flowers</option>
          <option value="none">None</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-bmb-pink to-bmb-purple font-medium disabled:opacity-60"
        >
          <FiPlus /> {saving ? "Adding..." : "Add Page"}
        </button>
        <p className="sm:col-span-2 text-xs text-white/40">
          Tip: upload the image in the Gallery tab first, copy its Cloudinary URL, then paste it
          here. A dedicated file-picker can be wired the same way as the Gallery uploader.
        </p>
      </form>

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page._id} className="glass rounded-2xl overflow-hidden">
              {page.photoUrl && (
                <img src={page.photoUrl} alt={page.caption} className="w-full h-32 object-cover" />
              )}
              <div className="p-3">
                <p className="text-xs text-bmb-gold mb-1">Page {page.pageNumber}</p>
                <p className="text-sm">{page.caption}</p>
                <button
                  onClick={() => handleDelete(page._id)}
                  className="mt-2 text-white/60 hover:text-red-400"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPagesManager;
