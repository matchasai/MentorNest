// Admin Mentors management page for MentorNest with modern UI
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBook, FaEnvelope, FaUserTie } from "react-icons/fa";
import { createMentor, deleteMentor, getMentors, updateMentor } from "../../services/adminService";

const PAGE_SIZE = 5;
const initialForm = { name: "", email: "", expertise: "", bio: "" };

const AdminMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchMentors = () => {
    setLoading(true);
    getMentors()
      .then(setMentors)
      .catch(() => toast.error("Failed to load mentors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("mentor", new Blob([JSON.stringify(form)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        await updateMentor(editingId, formData);
        toast.success("Mentor updated");
      } else {
        await createMentor(formData);
        toast.success("Mentor created");
      }
      setForm(initialForm);
      setEditingId(null);
      setImageFile(null);
      setImagePreview("");
      fetchMentors();
    } catch {
      setError("Failed to save mentor. Check for duplicate email or invalid data.");
    }
  };

  const handleEdit = (mentor) => {
    setForm({ name: mentor.name, email: mentor.email, expertise: mentor.expertise, bio: mentor.bio || "" });
    setEditingId(mentor.id);
    setImagePreview(mentor.imageUrl || "");
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    try {
      await deleteMentor(id);
      toast.success("Mentor deleted");
      fetchMentors();
    } catch {
      toast.error("Failed to delete mentor");
    }
  };

  const filtered = mentors.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-200 flex items-center gap-3"><FaUserTie /> Mentor Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-800/70 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Text Inputs */}
          <div className="relative">
            <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
            <input type="text" id="mentor-name" className="peer w-full border border-gray-700 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-transparent" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required autoComplete="off" placeholder="Name" />
            <label htmlFor="mentor-name" className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-300 bg-gray-900 px-1" style={{background: 'inherit'}}>Name</label>
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
            <input type="email" id="mentor-email" className="peer w-full border border-gray-700 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-transparent" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoComplete="off" placeholder="Email" />
            <label htmlFor="mentor-email" className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-300 bg-gray-900 px-1" style={{background: 'inherit'}}>Email</label>
          </div>
          <div className="relative sm:col-span-2">
            <FaBook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
            <input type="text" id="mentor-expertise" className="peer w-full border border-gray-700 rounded-full px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-transparent" value={form.expertise} onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))} required autoComplete="off" placeholder="Expertise" />
            <label htmlFor="mentor-expertise" className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-300 bg-gray-900 px-1" style={{background: 'inherit'}}>Expertise</label>
          </div>
          <div className="relative sm:col-span-2">
             <textarea id="mentor-bio" rows="3" className="peer w-full border border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-transparent" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Bio" />
            <label htmlFor="mentor-bio" className="absolute left-4 -top-2.5 text-xs text-blue-300 bg-gray-800 px-1">Bio</label>
          </div>
          {/* Image Upload */}
          <div className="sm:col-span-2 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border-2 border-gray-700">
              {imagePreview ? (
                <img src={imagePreview} alt="Mentor Preview" className="w-full h-full object-cover" />
              ) : (
                <FaUserTie className="text-4xl text-gray-500" />
              )}
            </div>
            <label htmlFor="mentor-image-upload" className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition">
              {editingId ? "Change Image" : "Upload Image"}
            </label>
            <input id="mentor-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-green-400 text-white rounded-full hover:from-blue-700 hover:to-green-500 transition font-semibold shadow-md">
            {editingId ? "Update Mentor" : "Create Mentor"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); setImagePreview(""); setImageFile(null); }} className="px-5 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition font-semibold shadow-md">Cancel</button>
          )}
        </div>
        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
      </form>
      {/* Search and Table */}
      <div className="mb-6">
        <input type="text" placeholder="Search by name or email" className="border border-gray-700 rounded-full px-5 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-100 shadow-md" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>
      {loading ? (
        <div className="text-center text-gray-300">Loading mentors...</div>
      ) : (
        <div className="overflow-x-auto bg-gray-800/80 rounded-2xl shadow-xl border border-gray-700">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-blue-200">Image</th>
                <th className="py-3 px-4 text-left text-blue-200">Name</th>
                <th className="py-3 px-4 text-left text-blue-200">Email</th>
                <th className="py-3 px-4 text-left text-blue-200">Expertise</th>
                <th className="py-3 px-4 text-center text-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((mentor) => (
                <tr key={mentor.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                  <td className="py-2 px-4">
                    <img src={mentor.imageUrl || 'https://via.placeholder.com/40'} alt={mentor.name} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="py-2 px-4 text-gray-100">{mentor.name}</td>
                  <td className="py-2 px-4 text-gray-100">{mentor.email}</td>
                  <td className="py-2 px-4 text-gray-300">{mentor.expertise}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button onClick={() => handleEdit(mentor)} className="text-blue-300 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(mentor.id)} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 p-4 justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-full text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentors; 