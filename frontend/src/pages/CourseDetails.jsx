import { toAbsoluteUrl } from "../utils/url";
// Enhanced Course details page for MentorNest with interactive modules
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaArrowLeft,
    FaArrowRight,
    FaBook,
    FaCertificate,
    FaCheckCircle,
    FaClock,
    FaPlayCircle,
    FaStar,
    FaUser,
    FaUserGraduate
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import CertificatePreview from "../components/CertificatePreview";
import PaymentModal from "../components/PaymentModal";
import ProgressTracker from "../components/ProgressTracker";
import VideoPlayer from "../components/VideoPlayer";
import YouTubePlayerSimple from "../components/YouTubePlayerSimple";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getCourseDetails } from "../services/courseService";

const mentorColors = [
  "bg-blue-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-indigo-500"
];

const CourseDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [progress, setProgress] = useState(0);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getCourseDetails(id)
      .then((data) => {
        setCourse(data);
        // Only fetch modules if not enrolled (for preview)
        if (!enrolled) {
          return api.get(`/courses/${id}/modules`);
        }
        return Promise.resolve({ data: [] });
      })
      .then((res) => {
        if (!enrolled) {
          setModules(res.data);
          if (res.data.length > 0) {
            setSelectedModule(res.data[0]);
          }
        }
      })
      .catch(() => toast.error("Failed to load course details"))
      .finally(() => setLoading(false));
  }, [id, enrolled]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "STUDENT") {
      api.get(`/student/my-courses`).then(res => {
        setEnrolled(res.data.some(c => c.id === Number(id)));
      });
    }
  }, [isAuthenticated, user, id]);

  // Fetch enrollment details if enrolled
  useEffect(() => {
    if (enrolled && isAuthenticated && user?.role === "STUDENT") {
      api.get(`/student/courses/${id}/modules-with-status`).then(res => {
        setModules(res.data.modules || []);
        setCompletedModules(res.data.completedModules || []);
        setCertificateUrl(res.data.certificateUrl || "");
        if (res.data.modules && res.data.modules.length > 0) {
          setSelectedModule(res.data.modules[0]);
        }
      });
      api.get(`/student/courses/${id}/progress`).then(res => {
        // Ensure progress is between 0 and 1 (0% to 100%)
        const progressValue = Math.min(Math.max(res.data, 0), 1);
        setProgress(progressValue);
      }).catch(() => {
        setProgress(0);
      });
    }
  }, [enrolled, id, isAuthenticated, user]);

  // Check payment status
  useEffect(() => {
    if (isAuthenticated && user?.role === "STUDENT" && course) {
      api.get(`/payment/check/${id}`).then(res => {
        setHasPaid(res.data.hasPaid);
      }).catch(() => {
        setHasPaid(false);
      });
    }
  }, [isAuthenticated, user, id, course]);

  const handleEnroll = async () => {
    try {
      if (!hasPaid) {
        setShowPaymentModal(true);
        return;
      }

      const response = await api.post(`/student/enroll/${id}`);
      if (response.data.success) {
        setEnrolled(true);
        toast.success("Successfully enrolled in the course!");
      }
    } catch (error) {
      toast.error("Failed to enroll in the course");
    }
  };

  const handlePaymentComplete = () => {
    setHasPaid(true);
    setShowPaymentModal(false);
    toast.success("Payment completed! You can now enroll in the course.");
  };

  const handleMarkComplete = async (moduleId) => {
    try {
      await api.post(`/student/courses/${id}/modules/${moduleId}/complete`);
      setCompletedModules(prev => [...prev, moduleId]);
      
      // Refresh progress
      const progressRes = await api.get(`/student/courses/${id}/progress`);
      const progressValue = Math.min(Math.max(progressRes.data, 0), 1);
      setProgress(progressValue);
      
      toast.success("Module marked as complete!");
    } catch (error) {
      toast.error("Failed to mark module as complete");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await api.get(`/student/courses/${id}/certificate/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${course.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`);
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

  const handleModuleSelect = (module, index) => {
    setSelectedModule(module);
    setCurrentModuleIndex(index);
    setVideoPlaying(false);
  };

  const handleNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      const nextModule = modules[currentModuleIndex + 1];
      handleModuleSelect(nextModule, currentModuleIndex + 1);
    }
  };

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      handleModuleSelect(prevModule, currentModuleIndex - 1);
    }
  };

  const isModuleCompleted = (moduleId) => completedModules.includes(moduleId);

  // Handle viewing module resources
  const handleViewResource = (resourceUrl) => {
    if (resourceUrl) {
      let fullUrl;
      
      // Clean up any malformed URLs
      if (resourceUrl.includes('http://localhost:8081http')) {
        // Fix double protocol issue
        fullUrl = resourceUrl.replace('http://localhost:8081http', 'http');
      } else if (resourceUrl.startsWith('http')) {
        // Use as-is if it's already a full URL
        fullUrl = resourceUrl;
      } else {
        // Prepend base URL if it's just a path
        fullUrl = toAbsoluteUrl(resourceUrl);
      }
      
      console.log('Opening resource URL:', fullUrl);
      window.open(fullUrl, '_blank');
    } else {
      toast.error("Resource not available");
    }
  };

  // Handle downloading module resources
  const handleDownloadResource = async (resourceUrl) => {
    if (!resourceUrl) {
      toast.error("Resource not available");
      return;
    }

    try {
      let fullUrl;
      
      // Clean up any malformed URLs
      if (resourceUrl.includes('http://localhost:8081http')) {
        // Fix double protocol issue
        fullUrl = resourceUrl.replace('http://localhost:8081http', 'http');
      } else if (resourceUrl.startsWith('http')) {
        // Use as-is if it's already a full URL
        fullUrl = resourceUrl;
      } else {
        // Prepend base URL if it's just a path
        fullUrl = toAbsoluteUrl(resourceUrl);
      }
      
      console.log('Downloading resource URL:', fullUrl);
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error('Failed to download resource');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from resourceUrl
      const filename = resourceUrl.split('/').pop().replace(/^[^_]*_/, '') || 'resource.pdf';
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Resource downloaded successfully!");
    } catch (error) {
      console.error("Resource download error:", error);
      toast.error("Failed to download resource. Please try again.");
    }
  };

  // Calculate progress based on completed modules as fallback
  const calculateProgress = () => {
    if (modules.length === 0) return 0;
    const completedCount = completedModules.length;
    return Math.min(completedCount / modules.length, 1);
  };

  // Use calculated progress if backend progress seems incorrect
  const displayProgress = progress > 1 ? calculateProgress() : progress;

  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  // Not enrolled view: Enhanced Course Preview
  if (!enrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4">
            {/* Back Button */}
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors font-medium bg-white bg-opacity-10 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <FaArrowLeft />
              Back to Courses
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-blue-100">
                    <FaClock className="text-lg" />
                    <span className="text-lg">{modules.length} modules • ~{modules.length * 2} hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-300">
                    <FaStar className="text-lg" />
                    <span className="text-lg font-semibold">4.8/5 (245 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-300">
                    <FaUserGraduate className="text-lg" />
                    <span className="text-lg">1,250+ students</span>
                  </div>
                </div>

                <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl">
                  {course.description}
                </p>

                {/* Mentor Info in Hero */}
                <div className="flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                  {course.mentorImageUrl ? (
                    <img
                      src={course.mentorImageUrl}
                      alt={course.mentorName}
                      className="w-16 h-16 rounded-full object-cover shadow-lg border-3 border-white"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${mentorColors[id % mentorColors.length]}`}>
                      {course.mentorName ? course.mentorName.split(" ").map(n => n[0]).join("") : <FaUserGraduate className="text-3xl" />}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">{course.mentorName}</h3>
                    <p className="text-blue-100">Expert Mentor & Industry Professional</p>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">₹{course.price}</div>
                    <div className="text-gray-600">One-time payment</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Modules</span>
                      <span className="font-semibold text-gray-800">{modules.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-800">~{modules.length * 2} hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Level</span>
                      <span className="font-semibold text-gray-800">Beginner to Advanced</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Certificate</span>
                      <span className="font-semibold text-green-600">✓ Included</span>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-lg shadow-lg"
                    >
                      <FaBook />
                      Login to Enroll
                    </button>
                  )}
                  {isAuthenticated && user?.role === "STUDENT" && (
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 text-lg shadow-lg transform hover:scale-105"
                    >
                      <FaPlayCircle />
                      {hasPaid ? "Enroll Now (Paid)" : `Purchase & Enroll`}
                    </button>
                  )}
                  
                  {isAuthenticated && user?.role === "STUDENT" && !hasPaid && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      * Payment required to access course content
                    </p>
                  )}

                  {/* Money-back guarantee */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">💰 30-day money-back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Course Preview Video */}
              {modules[0]?.videoUrl && (
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center">Course Preview</h3>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      {isYouTubeUrl(modules[0].videoUrl) ? (
                        <YouTubePlayerSimple
                          videoUrl={modules[0].videoUrl}
                          title="Course Preview"
                        />
                      ) : (
                        <VideoPlayer
                          src={modules[0].videoUrl}
                          title="Course Preview"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* What You'll Learn */}
              {modules.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg p-8">
                  <h3 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                    What You'll Learn
                  </h3>
                  <div className="grid gap-4">
                    {modules.map((module, index) => (
                      <div key={module.id} className="group flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-100 hover:border-blue-200">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg mb-2">{module.title}</h4>
                          {module.description && (
                            <p className="text-gray-600 leading-relaxed">{module.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaPlayCircle className="text-blue-500" />
                              Video lesson
                            </span>
                            <span className="flex items-center gap-1">
                              <FaBook className="text-green-500" />
                              Resources included
                            </span>
                          </div>
                        </div>
                        <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaArrowRight />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Features */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <h3 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                  Course Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaPlayCircle className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">HD Video Lessons</h4>
                      <p className="text-gray-600 text-sm">High-quality video content</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaBook className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Study Materials</h4>
                      <p className="text-gray-600 text-sm">Downloadable resources</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaCertificate className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Certificate</h4>
                      <p className="text-gray-600 text-sm">Upon completion</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FaClock className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Lifetime Access</h4>
                      <p className="text-gray-600 text-sm">Learn at your pace</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar with additional info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Learning Path */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Learning Path</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
                    <span className="text-gray-700">Foundation Concepts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">2</div>
                    <span className="text-gray-700">Practical Applications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">3</div>
                    <span className="text-gray-700">Advanced Techniques</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">✓</div>
                    <span className="text-gray-700">Certification</span>
                  </div>
                </div>
              </div>

              {/* Student Reviews */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Student Reviews</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">"Excellent course with practical examples!"</p>
                    <p className="text-gray-500 text-xs mt-1">- Sarah M.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">"The mentor explains everything clearly."</p>
                    <p className="text-gray-500 text-xs mt-1">- John D.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            course={course}
            onClose={() => setShowPaymentModal(false)}
            onComplete={handlePaymentComplete}
          />
        )}
      </div>
    );
  }

  // Enrolled view: Enhanced Interactive Learning Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 relative">
      <div className="max-w-full mx-auto py-6 px-4 relative z-10"
           style={{ transform: 'translateZ(0)' }}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 transition-all px-4 py-2 rounded-lg font-medium border border-blue-600"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          {displayProgress >= 1 && (
            <button
              onClick={() => setShowCertificatePreview(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              <FaCertificate />
              🎉 View Certificate
            </button>
          )}
        </div>

        {/* Enhanced Course Header with Progress */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-6">
            {course.imageUrl && (
              <div className="relative">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {Math.round(displayProgress * 100)}%
                </div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{course.title}</h1>
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <span className="flex items-center gap-2">
                  <FaBook className="text-blue-500" />
                  {modules.length} modules
                </span>
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  {completedModules.length} completed
                </span>
                <span className="flex items-center gap-2">
                  <FaUser className="text-purple-500" />
                  {course.mentorName}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${displayProgress * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {displayProgress >= 1 ? 
                  "🎉 Congratulations! Course completed!" : 
                  `${Math.round((1 - displayProgress) * 100)}% remaining to complete`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="ml-96 pl-6">
          {/* Enhanced Sidebar - Module List (Truly Fixed on Left) */}
          <div className="fixed top-20 left-6 w-80 h-[calc(100vh-6rem)] z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
               style={{ 
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                 transform: 'translateZ(0)',
                 backfaceVisibility: 'hidden'
               }}>
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaBook className="text-white text-sm" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Course Modules</h2>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">{completedModules.length}</div>
                    <div className="text-xs text-gray-500">Completed</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">{modules.length - completedModules.length}</div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Modules Container */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 h-[calc(100%-140px)]">
              {/* Enhanced Progress Tracker */}
              <div className="mt-2">
                <ProgressTracker 
                  modules={modules}
                  completedModules={completedModules}
                  currentModuleIndex={currentModuleIndex}
                  onModuleSelect={handleModuleSelect}
                  className="" 
                />
              </div>
            </div>
          </div>

          {/* Enhanced Main Content - Video Player */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
              {selectedModule ? (
                <div>
                  {/* Enhanced Video Player */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                    {isYouTubeUrl(selectedModule.videoUrl) ? (
                      <YouTubePlayerSimple
                        videoUrl={selectedModule.videoUrl}
                        title={selectedModule.title}
                      />
                    ) : (
                      <VideoPlayer
                        src={selectedModule.videoUrl}
                        title={selectedModule.title}
                      />
                    )}
                    
                    {/* Video Overlay Info */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                      <div className="text-sm font-medium">Module {currentModuleIndex + 1}/{modules.length}</div>
                    </div>
                  </div>

                  {/* Enhanced Module Info */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">{selectedModule.title}</h2>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            Module {currentModuleIndex + 1} of {modules.length}
                          </span>
                          {selectedModule.duration && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaClock className="text-blue-500" />
                              <span>{selectedModule.duration}</span>
                            </div>
                          )}
                          {isModuleCompleted(selectedModule.id) && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              <FaCheckCircle />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Module Navigation */}
                    <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-xl">
                      <button
                        onClick={handlePrevModule}
                        disabled={currentModuleIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          currentModuleIndex === 0 
                            ? 'text-gray-400 cursor-not-allowed bg-gray-200' 
                            : 'text-blue-600 hover:bg-blue-100 bg-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        <FaArrowLeft />
                        Previous
                      </button>

                      {!isModuleCompleted(selectedModule.id) && (
                        <button
                          onClick={() => handleMarkComplete(selectedModule.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-lg transform hover:scale-105"
                        >
                          Mark as Complete
                        </button>
                      )}

                      <button
                        onClick={handleNextModule}
                        disabled={currentModuleIndex === modules.length - 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          currentModuleIndex === modules.length - 1 
                            ? 'text-gray-400 cursor-not-allowed bg-gray-200' 
                            : 'text-blue-600 hover:bg-blue-100 bg-white shadow-sm hover:shadow-md'
                        }`}
                      >
                        Next
                        <FaArrowRight />
                      </button>
                    </div>

                    {selectedModule.description && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaBook className="text-purple-600 text-sm" />
                          </div>
                          Module Overview
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                          <p className="text-gray-700 leading-relaxed text-lg">{selectedModule.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Module Resources Section */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBook className="text-blue-600 text-sm" />
                        </div>
                        Module Resources
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                        <div className="grid gap-4">
                          {/* Video Resource */}
                          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                              <FaPlayCircle className="text-red-600 text-xl" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">Video Lesson</h4>
                              <p className="text-sm text-gray-600">Main learning video for this module</p>
                            </div>
                            <div className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">Available</div>
                          </div>

                          {/* Module Resource Files */}
                          {selectedModule.resourceUrl ? (
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaBook className="text-blue-600 text-xl" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">Study Materials</h4>
                                <p className="text-sm text-gray-600">
                                  {selectedModule.resourceUrl.split('/').pop().replace(/^[^_]*_/, '')}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleViewResource(selectedModule.resourceUrl)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => handleDownloadResource(selectedModule.resourceUrl)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl border border-gray-200">
                              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                                <FaBook className="text-gray-400 text-xl" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-600">Study Materials</h4>
                                <p className="text-sm text-gray-500">No additional resources available for this module</p>
                              </div>
                              <div className="text-sm text-gray-500 font-medium">Not Available</div>
                            </div>
                          )}
                        </div>
                        
                        {/* Resource Note */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <p className="text-sm text-blue-700">
                            <strong>💡 Tip:</strong> Download materials for offline access and review after completing the video lesson.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Module Navigation Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      {currentModuleIndex > 0 ? (
                        <div className="text-left">
                          <p className="text-sm text-gray-500">Previous Module</p>
                          <p className="font-semibold text-gray-800">{modules[currentModuleIndex - 1]?.title}</p>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      {currentModuleIndex < modules.length - 1 ? (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Next Module</p>
                          <p className="font-semibold text-gray-800">{modules[currentModuleIndex + 1]?.title}</p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Module to Start Learning</h3>
                  <p className="text-gray-600">Choose a module from the sidebar to begin your learning journey</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificatePreview && (
        <CertificatePreview
          course={course}
          onClose={() => setShowCertificatePreview(false)}
          onDownload={handleDownloadCertificate}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          course={course}
          onClose={() => setShowPaymentModal(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default CourseDetails; 