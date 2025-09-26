import { toAbsoluteUrl } from "../../utils/url";
// Admin Courses management page for MentorNest with modern UI
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBook, FaChalkboardTeacher, FaDollarSign } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { createCourse, deleteCourse, getAdminCourses, getMentors, updateCourse } from "../../services/adminService";
import api from "../../services/api";

const PAGE_SIZE = 5;
const initialForm = { title: "", description: "", price: "", mentorId: "", imageUrl: "" };

const validateCourseForm = (form) => {
  if (!form.title || !form.title.trim()) return "Title is required.";
  if (!form.description || !form.description.trim()) return "Description is required.";
  if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return "Price must be a positive number.";
  return null;
};



const AdminCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchCoursesAndMentors = () => {
    setLoading(true);
    Promise.all([getAdminCourses(), getMentors()])
      .then(([coursesData, mentorsData]) => {
        setCourses(coursesData);
        setMentors(mentorsData);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoursesAndMentors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateCourseForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const courseData = { 
        title: form.title, 
        description: form.description, 
        price: Number(form.price), 
        imageUrl: form.imageUrl,
        mentorId: form.mentorId ? Number(form.mentorId) : null
      };
      let savedCourse;
      if (editingId) {
        try {
          savedCourse = await updateCourse(editingId, courseData);
          toast.success("Course updated");
        } catch (err) {
          if (err.response && (err.response.status === 403 || err.response.status === 404)) {
            toast.error("Course not found. It may have been deleted.");
            setForm(initialForm);
            setEditingId(null);
            fetchCoursesAndMentors();
            return;
          }
          throw err;
        }
      } else {
        savedCourse = await createCourse(courseData);
        toast.success("Course created");
      }


      setForm(initialForm);
      setEditingId(null);
      fetchCoursesAndMentors();
    } catch (err) {
      console.error("Course save error:", err);
      if (err.response && (err.response.status === 403 || err.response.status === 404)) {
        toast.error("Course not found. It may have been deleted.");
        setForm(initialForm);
        setEditingId(null);
        fetchCoursesAndMentors();
        return;
      }
      const errorMessage = err?.response?.data?.message || err?.response?.data || "Failed to save course. Please check your inputs.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (course) => {
    if (!courses.find(c => c.id === course.id)) {
      toast.error("Course not found. It may have been deleted.");
      setForm(initialForm);
      setEditingId(null);
      fetchCoursesAndMentors();
      return;
    }
    setForm({ 
      title: course.title, 
      description: course.description, 
      price: course.price, 
      mentorId: course.mentorId || "",
      imageUrl: course.imageUrl || ""
    });
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted");
      setForm(initialForm);
      setEditingId(null);
      fetchCoursesAndMentors();
    } catch (err) {
      toast.error("Failed to delete course");
      setForm(initialForm);
      setEditingId(null);
      fetchCoursesAndMentors();
    }
  };

  // Module management moved to separate AdminModules page

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Enhanced Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-blue-200 flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FaBook className="text-white text-xl" />
          </div>
          Course Management
        </h2>
        <p className="text-gray-400 text-lg">Create and manage your course offerings</p>
      </div>
      
      {/* Enhanced Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl p-8 flex flex-col gap-8 border border-gray-600">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Enhanced Title Field */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-sm" />
              </div>
              <label htmlFor="course-title" className="text-sm font-semibold text-gray-300">Course Title</label>
            </div>
            <input 
              type="text" 
              id="course-title" 
              className="w-full border-2 border-gray-600 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100 text-lg transition-all duration-200" 
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
              required 
              autoComplete="off" 
              placeholder="Enter course title..." 
            />
          </div>
          
          {/* Enhanced Price Field */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-white text-sm" />
              </div>
              <label htmlFor="course-price" className="text-sm font-semibold text-gray-300">Course Price</label>
            </div>
            <input 
              type="number" 
              id="course-price" 
              className="w-full border-2 border-gray-600 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100 text-lg transition-all duration-200" 
              value={form.price} 
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))} 
              required 
              autoComplete="off" 
              placeholder="Enter price..." 
            />
          </div>
          {/* Enhanced Assign Mentor Field */}
          <div className="relative sm:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaChalkboardTeacher className="text-white text-sm" />
              </div>
              <label htmlFor="course-mentor" className="text-sm font-semibold text-gray-300">Assign Mentor</label>
            </div>
            <select 
              id="course-mentor" 
              className="w-full border-2 border-gray-600 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100 text-lg transition-all duration-200 appearance-none" 
              value={form.mentorId} 
              onChange={e => setForm(f => ({ ...f, mentorId: e.target.value }))}
            >
              <option value="">Select a Mentor</option>
              {mentors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.expertise}
                </option>
              ))}
            </select>
            
            {/* Selected Mentor Preview */}
            {form.mentorId && (
              <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                {(() => {
                  const selectedMentor = mentors.find(m => m.id == form.mentorId);
                  return selectedMentor ? (
                    <div className="flex items-center gap-3">
                      {selectedMentor.imageUrl ? (
                        <img 
                          src={selectedMentor.imageUrl} 
                          alt={selectedMentor.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          {selectedMentor.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-100">{selectedMentor.name}</p>
                        <p className="text-sm text-gray-400">{selectedMentor.expertise}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
          {/* Enhanced Description Field */}
          <div className="relative sm:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-sm" />
              </div>
              <label htmlFor="course-description" className="text-sm font-semibold text-gray-300">Course Description</label>
            </div>
            <textarea 
              id="course-description" 
              rows="4" 
              className="w-full border-2 border-gray-600 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100 text-lg transition-all duration-200 resize-none" 
              value={form.description} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
              required 
              autoComplete="off" 
              placeholder="Describe what students will learn in this course..." 
            />
          </div>
          {/* Image URL Field */}
          <div className="relative sm:col-span-2">
            <input
              type="file"
              accept="image/*"
              id="course-image-upload"
              className="peer w-full border border-gray-700 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-gray-100 placeholder-gray-400"
              onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                // Validate file type and size
                const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
                if (!allowedTypes.includes(file.type)) {
                  toast.error("Only JPG, PNG, or GIF images are allowed.");
                  return;
                }
                if (file.size > 2 * 1024 * 1024) {
                  toast.error("Image size must be less than 2MB.");
                  return;
                }
                setUploadingImage(true);
                const formData = new FormData();
                formData.append("image", file);
                try {
                  const res = await api.post("/admin/courses/upload-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
                  const imageUrl = res.data.startsWith('http') ? res.data : toAbsoluteUrl(res.data);
                  setForm(f => ({ ...f, imageUrl: imageUrl }));
                  toast.success("Image uploaded");
                } catch (err) {
                  console.error("Image upload error:", err);
                  toast.error("Failed to upload image");
                } finally {
                  setUploadingImage(false);
                }
              }}
            />
            <label htmlFor="course-image-upload" className="absolute left-4 -top-2.5 text-xs text-blue-300 bg-gray-800 px-1">Course Image</label>
            {uploadingImage && <div className="text-blue-400 text-xs mt-1">Uploading...</div>}
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Course Preview" className="mt-2 w-40 h-24 object-cover rounded shadow" />
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-green-400 text-white rounded-full hover:from-blue-700 hover:to-green-500 transition font-semibold shadow-md">
            {editingId ? "Update Course" : "Create Course"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }} className="px-5 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition font-semibold shadow-md">Cancel</button>
          )}
        </div>
        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
      </form>
      {/* ... (search bar and table remain the same) ... */}
      <div className="mb-6">
        <input type="text" placeholder="Search by title" className="border border-gray-700 rounded-full px-5 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-100 shadow-md" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>
      {loading ? (
        <div className="text-center text-gray-300">Loading courses...</div>
      ) : (
        <div className="overflow-x-auto bg-gray-800/80 rounded-2xl shadow-xl border border-gray-700">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-blue-200">Title</th>
                <th className="py-3 px-4 text-left text-blue-200">Mentor</th>
                <th className="py-3 px-4 text-left text-blue-200">Price</th>
                <th className="py-3 px-4 text-center text-blue-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((course) => (
                <tr key={course.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                  <td className="py-2 px-4 text-gray-100 flex items-center gap-2">
                    {course.imageUrl && (
                      <img 
                        src={course.imageUrl.startsWith('http') ? course.imageUrl : toAbsoluteUrl(course.imageUrl)} 
                        alt={course.title} 
                        className="w-16 h-10 object-cover rounded" 
                        style={{minWidth: '4rem'}}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {course.title}
                  </td>
                  <td className="py-2 px-4 text-gray-300">{course.mentorName || "N/A"}</td>
                  <td className="py-2 px-4 text-gray-300">₹{course.price}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center items-center">
                    <button onClick={() => handleEdit(course)} className="text-blue-300 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-400 hover:underline">Delete</button>
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

            {/* Module management moved to separate AdminModules page */}
    </div>
  );
};

export default AdminCourses; 