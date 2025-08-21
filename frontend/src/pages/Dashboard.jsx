import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaBookOpen, 
  FaGraduationCap, 
  FaAward, 
  FaClock, 
  FaFire, 
  FaStar,
  FaRocket,
  FaChartLine,
  FaPlay,
  FaTrophy,
  FaUsers,
  FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: [],
    completedCourses: 0,
    certificates: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (!user) {
        console.log('User not authenticated, skipping dashboard data fetch');
        setLoading(false);
        return;
      }

      // Use userService functions to get proper data
      try {
        const { getMyCourses, getUserStats } = await import('../services/userService');
        
        // Get courses and stats in parallel
        const [courses, stats] = await Promise.all([
          getMyCourses(),
          getUserStats()
        ]);
        
        setDashboardData({
          enrolledCourses: courses || [],
          completedCourses: stats?.completedCourses || 0,
          certificates: stats?.totalCertificates || 0,
          recentActivity: [],
          stats: stats // Store full stats for use in UI
        });
      } catch (serviceError) {
        console.log('Error using userService, trying fallback API calls:', serviceError);
        
        // Fallback: try direct API calls
        try {
          const coursesRes = await api.get('/student/my-courses');
          const courses = coursesRes.data || [];
          
          // Calculate completed courses based on progress
          const completedCount = courses.filter(course => 
            course.progress >= 100 || course.completed === true
          ).length;
          
          // Try to get certificates count
          let certificatesCount = 0;
          try {
            const certsRes = await api.get('/student/certificates');
            certificatesCount = certsRes.data?.length || 0;
          } catch (certError) {
            console.log('Could not fetch certificates:', certError);
          }
          
          setDashboardData({
            enrolledCourses: courses,
            completedCourses: completedCount,
            certificates: certificatesCount,
            recentActivity: []
          });
        } catch (fallbackError) {
          console.log('All API calls failed, using empty data:', fallbackError);
          setDashboardData({
            enrolledCourses: [],
            completedCourses: 0,
            certificates: 0,
            recentActivity: []
          });
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Don't show error toast for authentication issues
      if (error.response?.status !== 403 && error.response?.status !== 401) {
        toast.error("Failed to load dashboard data");
      }
      
      // Set empty data to prevent UI breaking
      setDashboardData({
        enrolledCourses: [],
        completedCourses: 0,
        certificates: 0,
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div 
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600 font-medium">Loading your dashboard...</p>
      </motion.div>
    </div>
  );

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div 
          className="flex flex-col items-center gap-6 text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <FaGraduationCap className="text-white text-2xl" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const statsData = [
    {
      icon: FaBookOpen,
      value: dashboardData.enrolledCourses?.length || 0,
      label: "Enrolled Courses",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: FaTrophy,
      value: dashboardData.completedCourses || 0,
      label: "Completed Courses",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50", 
      textColor: "text-green-600"
    },
    {
      icon: FaAward,
      value: dashboardData.certificates || 0,
      label: "Certificates Earned",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full opacity-20"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-20"
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-20"
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div 
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeIn} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Ready to continue your learning adventure? Let's make today count! ✨
              </p>
            </div>
            <motion.div 
              className="hidden md:block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <FaRocket className="text-white text-3xl" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className={`p-6 ${stat.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50`}
              variants={fadeIn}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="text-xl" />
                </motion.div>
                <motion.div 
                  className={`text-3xl font-bold ${stat.textColor}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
              </div>
              <p className="text-gray-700 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {/* Continue Learning */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50"
            variants={fadeIn}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaPlay className="text-white text-xl" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
            </div>
            
            {dashboardData.enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.enrolledCourses.slice(0, 2).map((course, index) => (
                  <motion.div 
                    key={index}
                    className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{course.title || 'Course Title'}</h3>
                        <p className="text-gray-600 text-sm">Progress: {course.progress || '0'}%</p>
                      </div>
                      <FaArrowRight className="text-green-600" />
                    </div>
                  </motion.div>
                ))}
                <Link
                  to="/courses"
                  className="inline-block w-full text-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  View All Courses
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50"
            variants={fadeIn}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaAward className="text-white text-xl" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Achievements</h2>
            </div>
            
            {dashboardData.certificates > 0 ? (
              <div className="space-y-4">
                <motion.div 
                  className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <FaStar className="text-yellow-600" />
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {dashboardData.certificates === 1 ? '1 Certificate Earned' : `${dashboardData.certificates} Certificates Earned`}
                      </h3>
                      <p className="text-gray-600 text-sm">Congratulations on your achievements!</p>
                    </div>
                  </div>
                </motion.div>
                <Link
                  to="/certificates"
                  className="inline-block w-full text-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  View All Certificates
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-600 mb-4">Complete courses to earn certificates!</p>
                <div className="text-yellow-600 font-medium">Your achievements will appear here ✨</div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Learning Progress */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <FaChartLine className="text-white text-xl" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Your Learning Journey</h2>
          </div>
          
          <div className="text-center py-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaUsers className="text-6xl text-purple-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Start Learning?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of students already transforming their careers with MentorNest!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Explore Courses
              </Link>
              <Link
                to="/mentors"
                className="px-6 py-3 bg-transparent border-2 border-purple-600 text-purple-600 rounded-xl font-medium hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Find Mentors
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
