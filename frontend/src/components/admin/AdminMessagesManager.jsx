import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import api from "../../api/axios.js";

const AdminMessagesManager = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/guestbook")
      .then(({ data }) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this message?")) return;
    try {
      await api.delete(`/guestbook/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Guestbook Messages</h2>
      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-white/50">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry._id} className="glass rounded-2xl p-4 flex items-start justify-between">
              <div>
                <p className="font-medium text-bmb-gold text-sm">
                  {entry.name || entry.author?.name} <span className="ml-1">{entry.emoji}</span>
                </p>
                <p className="text-white/70 text-sm mt-1">{entry.message}</p>
                <p className="text-white/30 text-xs mt-1">{entry.hearts || 0} hearts</p>
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

export default AdminMessagesManager;
