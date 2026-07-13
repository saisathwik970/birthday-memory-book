import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2, FiUpload } from "react-icons/fi";
import api from "../../api/axios.js";

const AdminVideoManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", caption: "", file: null });

  const load = () => {
    api
      .get("/videos")
      .then(({ data }) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error("Choose a video file first");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("video", form.file);
      fd.append("title", form.title);
      fd.append("caption", form.caption);
      const { data } = await api.post("/videos", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setItems((prev) => [data, ...prev]);
      setForm({ title: "", caption: "", file: null });
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await api.delete(`/videos/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Video Manager</h2>

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
          type="file"
          accept="video/*"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          className="sm:col-span-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={uploading}
          className="sm:col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-bmb-pink to-bmb-purple font-medium disabled:opacity-60"
        >
          <FiUpload /> {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="glass rounded-2xl overflow-hidden">
              <video src={item.videoUrl} className="w-full h-40 object-cover" muted />
              <div className="p-3">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-white/50 text-xs mb-2">{item.caption}</p>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-white/60 hover:text-red-400"
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

export default AdminVideoManager;
