import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import api from "../../api/axios.js";

const statusColors = {
  pending: "text-bmb-gold",
  approved: "text-green-400",
  rejected: "text-red-400",
};

const AdminMembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get("/members")
      .then(({ data }) => setMembers(data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const approve = async (id) => {
    try {
      const { data } = await api.put(`/members/${id}/approve`);
      setMembers((prev) => prev.map((m) => (m._id === id ? data : m)));
      toast.success("Member approved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const reject = async (id) => {
    try {
      const { data } = await api.put(`/members/${id}/reject`);
      setMembers((prev) => prev.map((m) => (m._id === id ? data : m)));
      toast.success("Member rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this member permanently?")) return;
    try {
      await api.delete(`/members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Members</h2>
      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : members.length === 0 ? (
        <p className="text-white/50">No member accounts yet.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m._id} className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-white/50 text-sm">
                  @{m.username} · <span className={statusColors[m.status]}>{m.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {m.status !== "approved" && (
                  <button
                    onClick={() => approve(m._id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-400"
                  >
                    <FiCheck /> Approve
                  </button>
                )}
                {m.status !== "rejected" && (
                  <button
                    onClick={() => reject(m._id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400"
                  >
                    <FiX /> Reject
                  </button>
                )}
                <button
                  onClick={() => remove(m._id)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-red-500/20 text-red-400"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMembersManager;
