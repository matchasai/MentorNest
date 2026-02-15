import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaArrowLeft,
    FaCertificate,
    FaCheckCircle,
    FaClock,
    FaDownload,
    FaExclamationTriangle,
    FaGraduationCap,
    FaSpinner,
    FaStar,
    FaSync,
    FaTrophy
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CertificatePreview from "../components/CertificatePreview";
import CertificateStatus from "../components/CertificateStatus";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getMyCourses } from "../services/userService";
import { toAbsoluteUrl } from "../utils/url";

const Certificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const loadCertificatesData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    if (!isRefresh) setLoading(true);
    
    try {
      // Only load courses if user is a STUDENT
      if (user?.role === 'STUDENT') {
        const coursesData = await getMyCourses();
        setCourses(coursesData);

        // Load progress for each course
        const progressData = {};
        await Promise.all(
          coursesData.map(async (course) => {
            try {
              const progressRes = await api.get(`/student/courses/${course.id}/progress`);
              progressData[course.id] = Math.min(Math.max(progressRes.data, 0), 1);
            } catch {
              progressData[course.id] = 0;
            }
          })
        );
        setProgress(progressData);
      }
      setLastUpdate(Date.now());
      
      if (isRefresh) {
        toast.success("Certificates data refreshed!");
      }
    } catch (error) {
      console.error("Failed to load certificates data:", error);
      toast.error("Failed to load certificates data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadCertificatesData();
  }, [loadCertificatesData]);

  const handleRefresh = () => {
    loadCertificatesData(true);
  };

  const handleDownloadCertificate = async (courseId, courseTitle) => {
    try {
      const response = await api.get(`/student/courses/${courseId}/certificate/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Certificate download error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data || "Course not completed. Please complete all modules first.");
      } else {
        toast.error("Failed to download certificate. Please try again.");
      }
    }
  };

  const handlePreviewCertificate = (course) => {
    setSelectedCourse(course);
    setShowCertificatePreview(true);
  };

  const getCompletedCoursesCount = () => {
    return courses.filter(course => (progress[course.id] || 0) >= 1).length;
  };

  const getInProgressCoursesCount = () => {
    return courses.filter(course => {
      const courseProgress = progress[course.id] || 0;
      return courseProgress > 0 && courseProgress < 1;
    }).length;
  };

  const getTotalCertificatesEarned = () => {
    return getCompletedCoursesCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  // Check if user is not a STUDENT
  if (user?.role !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8">
          <FaExclamationTriangle className="text-4xl text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificates Not Available</h2>
          <p className="text-lg text-gray-600 mb-6">
            Certificates are only available for students who complete courses.
          </p>
          <button
            onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/mentor-dashboard')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft />
            Go to {user?.role === 'ADMIN' ? 'Admin Panel' : 'Mentor Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaCertificate className="text-blue-600" />
              My Certificates
            </h1>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSync className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Certificates Earned</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{getTotalCertificatesEarned()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaTrophy className="text-2xl text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Courses Completed</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{getCompletedCoursesCount()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCheckCircle className="text-2xl text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">In Progress</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{getInProgressCoursesCount()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaClock className="text-2xl text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Courses Yet</h2>
            <p className="text-gray-500 mb-6">Enroll in courses to start earning certificates!</p>
            <button
              onClick={() => navigate('/courses')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Certificate Cards */}
            <div className="grid gap-6">
              {courses.map((course, index) => {
                const courseProgress = progress[course.id] || 0;
                const isCompleted = courseProgress >= 1;
                const inProgress = courseProgress > 0 && courseProgress < 1;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            {course.imageUrl && (
                              <img
                                src={course.imageUrl.startsWith('http') ? course.imageUrl : toAbsoluteUrl(course.imageUrl)}
                                alt={course.title}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                              <p className="text-gray-600">by {course.mentorName}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center text-yellow-500">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < 4 ? "text-yellow-500" : "text-gray-300"} />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">4.0 (120 reviews)</span>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm text-gray-500">{Math.round(courseProgress * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${courseProgress * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-2 rounded-full ${
                                  isCompleted ? "bg-green-500" : inProgress ? "bg-blue-500" : "bg-gray-300"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Certificate Status */}
                          <CertificateStatus
                            courseId={course.id}
                            courseTitle={course.title}
                            progress={courseProgress}
                            onRefresh={() => loadCertificatesData(true)}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 ml-6">
                          {isCompleted && (
                            <>
                              <button
                                onClick={() => handlePreviewCertificate(course)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <FaCertificate />
                                Preview
                              </button>
                              <button
                                onClick={() => handleDownloadCertificate(course.id, course.title)}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <FaDownload />
                                Download
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                          >
                            {isCompleted ? "Review Course" : inProgress ? "Continue" : "Start Course"}
                          </button>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <>
                                <FaCheckCircle className="text-green-500" />
                                <span className="text-green-600 font-medium">Completed</span>
                              </>
                            ) : inProgress ? (
                              <>
                                <FaClock className="text-blue-500" />
                                <span className="text-blue-600 font-medium">In Progress</span>
                              </>
                            ) : (
                              <>
                                <FaExclamationTriangle className="text-gray-400" />
                                <span className="text-gray-500 font-medium">Not Started</span>
                              </>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            {course.moduleCount || 0} modules • {course.duration || "~4 hours"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <FaCertificate className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Certificate Information</h3>
              <p className="text-gray-600 mb-4">
                Complete all modules in a course to earn your certificate. Certificates are automatically generated and include your name, course details, and completion date.
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(lastUpdate).toLocaleString()}
              </p>
            </motion.div>
          </div>
        )}

        {/* Certificate Preview Modal */}
        {showCertificatePreview && selectedCourse && (
          <CertificatePreview
            course={selectedCourse}
            user={user}
            onClose={() => setShowCertificatePreview(false)}
            onDownload={() => handleDownloadCertificate(selectedCourse.id, selectedCourse.title)}
          />
        )}
      </div>
    </div>
  );
};

export default Certificates;
