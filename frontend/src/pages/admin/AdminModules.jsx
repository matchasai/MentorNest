import { toAbsoluteUrl } from "../../utils/url";
// Admin Modules management page for MentorNest with modern UI
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBook, FaFilter, FaPencilAlt, FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { createModule, deleteModule, getAdminCourses, updateModule } from "../../services/adminService";
import api from "../../services/api";

const initialModuleForm = { title: "", videoUrl: "", summary: "", resourceUrl: "", courseId: "" };

const validateModuleForm = (form) => {
  if (!form.title || !form.title.trim()) return "Module title is required.";
  if (!form.videoUrl || !form.videoUrl.trim()) return "YouTube video URL is required.";
  if (!form.courseId) return "Please select a course.";
  // Simple YouTube URL validation
  const ytPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
  if (!ytPattern.test(form.videoUrl)) return "Please enter a valid YouTube URL.";
  if (!form.summary || !form.summary.trim()) return "Module summary is required.";
  return null;
};

const AdminModules = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialModuleForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [uploadingModuleResource, setUploadingModuleResource] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesData] = await Promise.all([
        getAdminCourses()
      ]);
      setCourses(coursesData);
      
      // Fetch all modules from all courses
      const allModules = [];
      for (const course of coursesData) {
        try {
          const modulesRes = await api.get(`/courses/${course.id}/modules`);
          const courseModules = modulesRes.data.map(module => ({
            ...module,
            courseTitle: course.title,
            courseId: course.id
          }));
          allModules.push(...courseModules);
        } catch (err) {
          console.error(`Failed to fetch modules for course ${course.id}:`, err);
        }
      }
      setModules(allModules);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateModuleForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      if (editingId) {
        await updateModule(editingId, form);
        toast.success("Module updated successfully!");
      } else {
        await createModule(form.courseId, form);
        toast.success("Module created successfully!");
      }
      
      setForm(initialModuleForm);
      setEditingId(null);
      setShowForm(false);
      fetchData(); // Refresh the list
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save module.");
    }
  };

  const handleEdit = (module) => {
    setForm({
      title: module.title,
      videoUrl: module.videoUrl,
      summary: module.summary || "",
      resourceUrl: module.resourceUrl || "",
      courseId: module.courseId
    });
    setEditingId(module.id);
    setShowForm(true);
  };

  const handleDelete = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    
    try {
      await deleteModule(moduleId);
      toast.success("Module deleted successfully!");
      fetchData(); // Refresh the list
    } catch (err) {
      toast.error("Failed to delete module.");
    }
  };

  const handleCancel = () => {
    setForm(initialModuleForm);
    setEditingId(null);
    setShowForm(false);
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(search.toLowerCase()) ||
                         module.courseTitle.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = !selectedCourse || module.courseId == selectedCourse;
    return matchesSearch && matchesCourse;
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Enhanced Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-blue-200 flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <FaBook className="text-white text-xl" />
          </div>
          Module Management
        </h2>
        <p className="text-gray-400 text-lg">Create and manage course modules across all courses</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              className="pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Course Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="pl-12 pr-8 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Module Button */}
        <button
          onClick={() => {
            setForm(initialModuleForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg"
        >
          <FaPlus />
          Add Module
        </button>
      </div>

      {/* Module Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h3 className="text-xl font-bold text-blue-200">
                {editingId ? "Edit Module" : "Add New Module"}
              </h3>
              <button
                onClick={handleCancel}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-gray-300 text-sm" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Select Course</label>
                  <select
                    className="w-full border-2 border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100"
                    value={form.courseId}
                    onChange={(e) => setForm({...form, courseId: e.target.value})}
                    required
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Module Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Module Title</label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    placeholder="Enter module title..."
                    required
                  />
                </div>
              </div>

              {/* YouTube Video URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">YouTube Video URL</label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100"
                  value={form.videoUrl}
                  onChange={(e) => setForm({...form, videoUrl: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              {/* Module Summary */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Module Summary</label>
                <textarea
                  className="w-full border-2 border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100 resize-none"
                  rows="3"
                  value={form.summary}
                  onChange={(e) => setForm({...form, summary: e.target.value})}
                  placeholder="Describe what students will learn in this module..."
                  required
                />
              </div>

              {/* Resource Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Module Resource (Optional)</label>
                <input
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  className="w-full border-2 border-gray-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    const allowedTypes = [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "application/vnd.ms-powerpoint",
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    ];
                    
                    if (!allowedTypes.includes(file.type)) {
                      toast.error("Only PDF, DOC, DOCX, PPT, or PPTX files are allowed.");
                      return;
                    }
                    
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File size must be less than 5MB.");
                      return;
                    }
                    
                    setUploadingModuleResource(true);
                    const formData = new FormData();
                    formData.append("file", file);
                    
                    try {
                      const res = await api.post("/admin/modules/upload-resource", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                      });
                      const resourceUrl = res.data.startsWith('http') ? res.data : toAbsoluteUrl(res.data);
                      setForm({...form, resourceUrl: resourceUrl});
                      toast.success("Resource uploaded successfully!");
                    } catch (err) {
                      toast.error("Failed to upload resource");
                    } finally {
                      setUploadingModuleResource(false);
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-6 py-3 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold"
                >
                  {editingId ? "Update Module" : "Add Module"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="grid gap-6">
        {filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-400 text-lg">No modules found</p>
            <p className="text-gray-500 text-sm mt-2">
              {search || selectedCourse ? "Try adjusting your search or filters" : "Create your first module"}
            </p>
          </div>
        ) : (
          filteredModules.map((module) => (
            <div key={module.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <FaBook className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">{module.title}</h3>
                      <p className="text-blue-300 text-sm">{module.courseTitle}</p>
                    </div>
                  </div>
                  
                  <div className="ml-13 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span className="truncate font-mono">{module.videoUrl}</span>
                    </div>
                    
                    {module.summary && (
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {module.summary}
                      </p>
                    )}
                    
                    {module.resourceUrl && (
                      <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                        <span className="text-lg">📄</span>
                        <span>Resource available</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-6">
                  <button
                    onClick={() => handleEdit(module)}
                    className="px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg text-white text-sm font-medium"
                    title="Edit module"
                  >
                    <FaPencilAlt className="text-white text-xs" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(module.id)}
                    className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg text-white text-sm font-medium"
                    title="Delete module"
                  >
                    <FaTrash className="text-white text-xs" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminModules; 