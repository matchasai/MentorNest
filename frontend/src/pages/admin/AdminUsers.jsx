// Admin Users management page for MentorNest with modern UI
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaUser, FaUserShield } from "react-icons/fa";
import { createUser, deactivateUser, deleteUser, getUsers, reactivateUser, resetUserPassword, updateUser } from "../../services/adminService";

const PAGE_SIZE = 5;
const initialForm = { name: "", email: "", role: "STUDENT" };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then(data => setUsers(data.filter(u => u.role !== 'ADMIN'))) // Filter out admins
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateUser(editingId, form);
        toast.success("User updated");
      } else {
        await createUser(form);
        toast.success("User created");
      }
      setForm(initialForm);
      setEditingId(null);
      fetchUsers();
    } catch {
      setError("Failed to save user. Check for duplicate email or invalid data.");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await deactivateUser(id);
      toast.success("User deactivated");
      fetchUsers();
    } catch {
      toast.error("Failed to deactivate user");
    }
  };
  const handleReactivate = async (id) => {
    try {
      await reactivateUser(id);
      toast.success("User reactivated");
      fetchUsers();
    } catch {
      toast.error("Failed to reactivate user");
    }
  };
  const handleResetPassword = async (id) => {
    const newPassword = prompt("Enter new password for this user:");
    if (!newPassword) return;
    try {
      await resetUserPassword(id, newPassword);
      toast.success("Password reset");
    } catch {
      toast.error("Failed to reset password");
    }
  };

  // Search and pagination
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-200 flex items-center gap-3"><FaUserShield /> User Management</h2>
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-800/70 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Name Field */}
            <div className="relative flex-1">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
              <input
                type="text"
                id="name"
                className="peer w-full border border-gray-700 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-transparent"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                autoComplete="off"
                placeholder="Name"
              />
              <label htmlFor="name"
                className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200
                  peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-300
                  peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-300
                  bg-gray-900 px-1"
                style={{background: 'inherit'}}
              >Name</label>
            </div>
            {/* Email Field */}
            <div className="relative flex-1">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
              <input
                type="email"
                id="email"
                className="peer w-full border border-gray-700 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-transparent"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="off"
                placeholder="Email"
              />
              <label htmlFor="email"
                className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200
                  peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-300
                  peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-300
                  bg-gray-900 px-1"
                style={{background: 'inherit'}}
              >Email</label>
            </div>
            {/* Role Field */}
            <div className="relative flex-1">
              <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
              <select
                id="role"
                className="peer w-full border border-gray-700 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 appearance-none"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              >
                <option value="STUDENT">Student</option>
              </select>
              <label htmlFor="role"
                className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200
                  peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-300
                  peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-300
                  bg-gray-900 px-1"
                style={{background: 'inherit'}}
              >Role</label>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-green-400 text-white rounded-full hover:from-blue-700 hover:to-green-500 transition font-semibold shadow-md">
              {editingId ? "Update User" : "Create User"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }} className="px-5 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition font-semibold shadow-md">Cancel</button>
            )}
          </div>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>
        <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-gray-700 rounded-full px-5 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-100 shadow-md"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {loading ? (
          <div className="text-center text-gray-300">Loading users...</div>
        ) : (
          <div className="overflow-x-auto bg-gray-800/80 rounded-2xl shadow-xl border border-gray-700">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-blue-200">Name</th>
                  <th className="py-3 px-4 text-left text-blue-200">Email</th>
                  <th className="py-3 px-4 text-left text-blue-200">Role</th>
                  <th className="py-3 px-4 text-center text-blue-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                    <td className="py-2 px-4 text-gray-100">{user.name}</td>
                    <td className="py-2 px-4 text-gray-100">{user.email}</td>
                    <td className="py-2 px-4 capitalize text-gray-300">{user.role.toLowerCase()}</td>
                    <td className="py-2 px-4 text-center flex gap-2 justify-center">
                      <button onClick={() => handleEdit(user)} className="text-blue-300 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:underline">Delete</button>
                      {user.active ? (
                        <button onClick={() => handleDeactivate(user.id)} className="text-yellow-400 hover:underline">Deactivate</button>
                      ) : (
                        <button onClick={() => handleReactivate(user.id)} className="text-green-400 hover:underline">Reactivate</button>
                      )}
                      <button onClick={() => handleResetPassword(user.id)} className="text-purple-400 hover:underline">Reset Password</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 p-4 justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-full text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers; 