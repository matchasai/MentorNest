import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
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
    FaUser
} from "react-icons/fa";
import CertificateStatus from "../components/CertificateStatus";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getMyCourses } from "../services/userService";

const Profile = () => {
  const { user, login } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", password: "" });
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadProfileData = useCallback(async (isRefresh = false, isAutoRefresh = false) => {
    if (!isRefresh && !isAutoRefresh) setLoading(true);
    
    try {
      // Only load courses if user is a STUDENT
      if (user?.role === 'STUDENT') {
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
      }
      
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
      if (!isRefresh && !isAutoRefresh) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfileData();
    
    // Auto-refresh profile data every 2 minutes
    const interval = setInterval(() => {
      loadProfileData(false, true);
    }, 120000);
    
    return () => clearInterval(interval);
  }, [loadProfileData]);

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
    } catch {
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and track your learning progress</p>
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
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-3xl" />
                  </div>
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaCheckCircle className="text-white text-sm" />
                  </motion.div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{user?.name || user?.email}</h2>
                <p className="text-gray-500 capitalize flex items-center justify-center gap-2 mt-1">
                  {user?.role?.toLowerCase() === 'student' && <FaGraduationCap className="text-blue-500" />}
                  {user?.role?.toLowerCase()}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-blue-500" />
                  <span className="text-gray-700 text-sm">{user?.email}</span>
                </div>
                {user?.role === 'STUDENT' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center border border-blue-100">
                        <FaGraduationCap className="text-2xl text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                        <div className="text-xs text-gray-600">Enrolled</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg text-center border border-green-100">
                        <FaCertificate className="text-2xl text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {Object.values(progress).filter(p => p >= 1).length}
                        </div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Average Progress</span>
                        <FaCheckCircle className="text-purple-500" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <motion.div
                            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.round(Object.values(progress).reduce((sum, p) => sum + p, 0) / Math.max(courses.length, 1) * 100)}%` 
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                        <span className="text-lg font-bold text-purple-600">
                          {Math.round(Object.values(progress).reduce((sum, p) => sum + p, 0) / Math.max(courses.length, 1) * 100)}%
                        </span>
                      </div>
                    </div>
                  </>
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
          {user?.role === 'STUDENT' ? (
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
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Mentor Dashboard'}
                </h3>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    {user?.role === 'ADMIN' 
                      ? 'Manage users, courses, and mentors from the Admin panel.' 
                      : 'Manage your courses and students from the Mentor Dashboard.'}
                  </p>
                  <a
                    href={user?.role === 'ADMIN' ? '/admin' : '/mentor-dashboard'}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to {user?.role === 'ADMIN' ? 'Admin Panel' : 'Mentor Dashboard'}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 