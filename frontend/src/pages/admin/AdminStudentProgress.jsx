import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  FaCheckCircle, 
  FaClock, 
  FaExclamationCircle, 
  FaGraduationCap, 
  FaSearch, 
  FaSpinner, 
  FaTrophy 
} from "react-icons/fa";
import api from "../../services/api";

const AdminStudentProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  const fetchStudentProgress = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/student-progress");
      setProgress(response.data);
    } catch (error) {
      toast.error("Failed to load student progress");
      console.error("Error fetching student progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        text: "Completed",
        bg: "bg-green-100",
        textColor: "text-green-700",
        icon: <FaCheckCircle className="text-green-600" />
      },
      "in-progress": {
        text: "In Progress",
        bg: "bg-blue-100",
        textColor: "text-blue-700",
        icon: <FaClock className="text-blue-600" />
      },
      "not-started": {
        text: "Not Started",
        bg: "bg-gray-100",
        textColor: "text-gray-700",
        icon: <FaExclamationCircle className="text-gray-600" />
      }
    };
    
    const badge = badges[status] || badges["not-started"];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.textColor}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Filter logic
  const filtered = progress.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.courseTitle?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading student progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaGraduationCap className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold">Student Progress Tracking</h1>
          </div>
          <p className="text-gray-400">Monitor student enrollment and course completion progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Enrollments</span>
              <FaGraduationCap className="text-blue-500 text-xl" />
            </div>
            <p className="text-2xl font-bold">{progress.length}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Completed</span>
              <FaTrophy className="text-green-500 text-xl" />
            </div>
            <p className="text-2xl font-bold text-green-500">
              {progress.filter(p => p.status === 'completed').length}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">In Progress</span>
              <FaClock className="text-blue-500 text-xl" />
            </div>
            <p className="text-2xl font-bold text-blue-500">
              {progress.filter(p => p.status === 'in-progress').length}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Not Started</span>
              <FaExclamationCircle className="text-gray-500 text-xl" />
            </div>
            <p className="text-2xl font-bold text-gray-400">
              {progress.filter(p => p.status === 'not-started').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, email, or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>
          </div>
        </div>

        {/* Progress Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Modules
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      {search || filterStatus !== "all" 
                        ? "No students match your filters" 
                        : "No student enrollments yet"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{item.name || "Unknown"}</div>
                          <div className="text-sm text-gray-400">{item.email || "N/A"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{item.courseTitle || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-300">{item.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${getProgressBarColor(item.progress || 0)}`}
                              style={{ width: `${item.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="text-white font-medium">{item.completedModules || 0}</span>
                          <span className="text-gray-400"> / {item.totalModules || 0}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        {filtered.length > 0 && (
          <div className="mt-4 text-sm text-gray-400 text-center">
            Showing {filtered.length} of {progress.length} enrollments
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentProgress;
