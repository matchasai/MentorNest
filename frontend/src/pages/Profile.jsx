import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaGraduationCap,
  FaSave,
  FaSpinner,
  FaSync,
  FaUser
} from "react-icons/fa";
import CertificateStatus from "../components/CertificateStatus";
import RealTimeIndicator from "../components/RealTimeIndicator";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getMyCourses } from "../services/userService";

const Profile = () => {
  const { user, login } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    loadProfileData();
    
    // Auto-refresh profile data every 2 minutes
    const interval = setInterval(() => {
      loadProfileData(false, true);
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const loadProfileData = async (isRefresh = false, isAutoRefresh = false) => {
    if (isRefresh && !isAutoRefresh) setRefreshing(true);
    if (!isRefresh && !isAutoRefresh) setLoading(true);
    
    try {
      const coursesData = await getMyCourses();
      setCourses(coursesData);
      
      // Load progress for each course with better error handling
      const progressData = {};
      
      await Promise.all(
        coursesData.map(async (course) => {
          try {
            // Get progress with validation
            const progressRes = await api.get(`/student/courses/${course.id}/progress`);
            const progressValue = Math.min(Math.max(progressRes.data, 0), 1);
            progressData[course.id] = progressValue;
          } catch (error) {
            console.error(`Error loading progress for course ${course.id}:`, error);
            progressData[course.id] = 0;
          }
        })
      );
      
      setProgress(progressData);
      setLastUpdate(Date.now());
      
      // Show success message if manually refreshing
      if (isRefresh && !isAutoRefresh) {
        toast.success("Profile data refreshed successfully!");
      }
    } catch (error) {
      if (!isAutoRefresh) {
        toast.error("Failed to load profile data");
      }
      console.error("Profile loading error:", error);
    } finally {
      if (isRefresh && !isAutoRefresh) setRefreshing(false);
      if (!isRefresh && !isAutoRefresh) setLoading(false);
    }
  };

  useEffect(() => {
    setForm((f) => ({ ...f, name: user?.name || user?.email || "" }));
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put("/auth/profile", form);
      toast.success("Profile updated successfully!");
      if (res.data.token) login(res.data.token);
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 70) return "text-blue-600";
    if (progress >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Real-time Status Indicator */}
        <RealTimeIndicator 
          isUpdating={refreshing}
          lastUpdate={lastUpdate}
          autoRefreshInterval={2}
          onRefresh={() => loadProfileData(true)}
          className="mb-4"
        />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your account and track your learning progress</p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => loadProfileData(true)}
                disabled={loading || refreshing}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <FaSync className={`${loading || refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-white text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{user?.name || user?.email}</h2>
                <p className="text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGraduationCap className="text-gray-400" />
                  <span className="text-gray-700">{courses.length} Enrolled Courses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCertificate className="text-gray-400" />
                  <span className="text-gray-700">
                    {Object.values(progress).filter(p => p >= 1).length} Courses Completed
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-gray-400" />
                  <span className="text-gray-700">
                    {Math.round(Object.values(progress).reduce((sum, p) => sum + p, 0) / Math.max(courses.length, 1) * 100)}% Average Progress
                  </span>
                </div>
                {lastUpdate && (
                  <div className="flex items-center space-x-3 pt-2 border-t border-gray-200">
                    <FaClock className="text-gray-400" />
                    <span className="text-gray-500 text-sm">
                      Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Update Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Settings</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {editing ? <FaSave className="text-lg" /> : <FaEdit className="text-lg" />}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {updating ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Display Name</span>
                    <p className="text-gray-800">{form.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="text-gray-800">{user?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Courses and Certificates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaGraduationCap className="mr-2 text-blue-600" />
                My Learning Journey
              </h3>

              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => {
                    const courseProgress = progress[course.id] || 0;
                    
                    return (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          {/* Course Image */}
                          {course.imageUrl && (
                            <img
                              src={course.imageUrl}
                              alt={course.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">{course.title}</h4>
                                <p className="text-sm text-gray-500">by {course.mentorName}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {courseProgress >= 1 ? (
                                  <FaCheckCircle className="text-green-500" />
                                ) : (
                                  <FaClock className="text-gray-400" />
                                )}
                                <span className={`text-sm font-medium ${getProgressColor(courseProgress * 100)}`}>
                                  {Math.round(courseProgress * 100)}% Complete
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(courseProgress * 100)}`}
                                  style={{ width: `${courseProgress * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Certificate Status */}
                            <CertificateStatus 
                              courseId={course.id}
                              courseTitle={course.title}
                              progress={courseProgress}
                              onRefresh={() => loadProfileData(true)}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 