import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiEdit2, FiUpload, FiMove } from "react-icons/fi";
import api from "../../api/axios.js";

const AdminGalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", caption: "", tags: "", file: null });
  const [dragIndex, setDragIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", caption: "" });

  const load = () => {
    api
      .get("/gallery")
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error("Choose an image first");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", form.file);
      fd.append("title", form.title);
      fd.append("caption", form.caption);
      fd.append("tags", form.tags);
      const { data } = await api.post("/gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setItems((prev) => [data, ...prev]);
      setForm({ title: "", caption: "", tags: "", file: null });
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({ title: item.title, caption: item.caption });
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await api.put(`/gallery/${id}`, editForm);
      setItems((prev) => prev.map((it) => (it._id === id ? data : it)));
      setEditingId(null);
      toast.success("Updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Drag & drop reordering
  const onDragStart = (idx) => setDragIndex(idx);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(idx, 0, moved);
    setItems(reordered);
    setDragIndex(null);
    try {
      await api.put("/gallery/reorder/bulk", { orderedIds: reordered.map((it) => it._id) });
    } catch {
      toast.error("Could not save new order");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Gallery Manager</h2>

      <form onSubmit={handleUpload} className="glass rounded-2xl p-5 mb-8 grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          type="text"
          placeholder="Caption"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={uploading}
          className="sm:col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-bmb-pink to-bmb-purple font-medium disabled:opacity-60"
        >
          <FiUpload /> {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={item._id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(idx)}
              className="glass rounded-2xl overflow-hidden cursor-move"
            >
              <div className="relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                <span className="absolute top-2 left-2 glass rounded-full p-1.5">
                  <FiMove className="text-white/70" />
                </span>
              </div>
              <div className="p-3">
                {editingId === item._id ? (
                  <div className="space-y-2">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-white/10 rounded-lg px-2 py-1 text-sm"
                    />
                    <input
                      value={editForm.caption}
                      onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                      className="w-full bg-white/10 rounded-lg px-2 py-1 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(item._id)}
                        className="text-xs px-3 py-1 rounded-full bg-bmb-purple"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1 rounded-full bg-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-white/50 text-xs mb-2">{item.caption}</p>
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(item)} className="text-white/60 hover:text-bmb-gold">
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-white/60 hover:text-red-400"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManager;
