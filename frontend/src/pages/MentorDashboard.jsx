import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaCalendarAlt, 
  FaChartLine, 
  FaStar, 
  FaBookOpen, 
  FaClock,
  FaRocket,
  FaTrophy,
  FaLightbulb,
  FaHeart,
  FaComment,
  FaEye
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    monthlyEarnings: 0,
    avgRating: 4.8
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      // Simulate API calls with mock data for demonstration
      setStats({
        totalStudents: 1250,
        totalCourses: 8,
        monthlyEarnings: 4500,
        avgRating: 4.9
      });
      
      setRecentStudents([
        { id: 1, name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg", course: "React Fundamentals", joined: "2 hours ago" },
        { id: 2, name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg", course: "Advanced JavaScript", joined: "1 day ago" },
        { id: 3, name: "Emily Davis", avatar: "https://randomuser.me/api/portraits/women/3.jpg", course: "UI/UX Design", joined: "3 days ago" }
      ]);
      
      setUpcomingSessions([
        { id: 1, title: "React Hooks Deep Dive", time: "2:00 PM", students: 25, duration: "1h 30m" },
        { id: 2, title: "JavaScript Best Practices", time: "4:30 PM", students: 18, duration: "2h" },
        { id: 3, title: "Career Guidance Session", time: "Tomorrow 10:00 AM", students: 12, duration: "1h" }
      ]);
    } catch (error) {
      console.error('Failed to load mentor data:', error);
      toast.error("Failed to load mentor data");
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
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-teal-50 to-blue-50">
      <motion.div 
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600 font-medium">Loading mentor dashboard...</p>
      </motion.div>
    </div>
  );

  const statsData = [
    {
      icon: FaUsers,
      value: stats.totalStudents.toLocaleString(),
      label: "Total Students",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      change: "+12%"
    },
    {
      icon: FaBookOpen,
      value: stats.totalCourses,
      label: "Active Courses",
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      change: "+2"
    },
    {
      icon: FaTrophy,
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      label: "Monthly Earnings",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      change: "+8%"
    },
    {
      icon: FaStar,
      value: stats.avgRating,
      label: "Average Rating",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      change: "+0.1"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {/* Welcome Header */}
          <motion.div 
            variants={fadeIn}
            className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="mentor-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mentor-grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FaChalkboardTeacher className="text-white text-xl" />
                  </motion.div>
                  <span className="text-white/80 font-medium">Mentor Dashboard</span>
                </div>
                
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, <span className="text-yellow-300">{user?.name}!</span>
                </h1>
                <p className="text-blue-100 text-lg flex items-center gap-2">
                  <FaHeart className="text-red-300" />
                  Inspiring learners and shaping futures ✨
                </p>
              </div>
              
              <motion.div 
                className="mt-6 md:mt-0 flex items-center gap-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-2">
                    <FaStar className="text-yellow-300 text-2xl" />
                  </div>
                  <div className="text-sm text-white/80">Top Rated</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={fadeIn}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
          >
            {statsData.map((stat) => (
              <motion.div
                key={stat.label}
                className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-12 h-12 ${stat.color} bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="text-xl" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-green-600 text-xs font-medium">
                  {stat.change} this month
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Sessions & Students */}
            <motion.div variants={fadeIn} className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-transparent hover:border-teal-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaCalendarAlt className="text-teal-500" />
                    Upcoming Sessions
                  </h2>
                  <Link 
                    to="/mentor/schedule" 
                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 group"
                  >
                    Manage Schedule
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      →
                    </motion.span>
                  </Link>
                </div>

                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <motion.div 
                        key={session.id}
                        className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-300 group"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors">
                              {session.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FaClock className="text-orange-500" />
                                {session.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaUsers className="text-blue-500" />
                                {session.students} students
                              </span>
                              <span className="flex items-center gap-1">
                                <FaBookOpen className="text-purple-500" />
                                {session.duration}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                              Join
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaCalendarAlt className="text-6xl text-teal-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-600 mb-6">Schedule your next session with students!</p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <FaCalendarAlt />
                      Schedule Session
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Recent Student Activity */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaUsers className="text-blue-500" />
                  Recent Student Activity
                </h2>
                
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <motion.div 
                      key={student.id}
                      className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{student.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{student.course}</p>
                          <p className="text-xs text-blue-600">Joined {student.joined}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                            <FaComment className="text-sm" />
                          </button>
                          <button className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                            <FaEye className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Quick Actions & Insights */}
            <motion.div variants={fadeIn} className="space-y-8">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-transparent hover:border-purple-200 transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaRocket className="text-purple-500" />
                  Quick Actions
                </h2>
                
                <div className="space-y-3">
                  {[
                    { text: "Create New Course", desc: "Share your expertise", color: "blue", icon: FaBookOpen },
                    { text: "Schedule Session", desc: "Plan upcoming classes", color: "green", icon: FaCalendarAlt },
                    { text: "View Analytics", desc: "Track your performance", color: "purple", icon: FaChartLine },
                    { text: "Student Messages", desc: "Connect with learners", color: "orange", icon: FaComment }
                  ].map((action) => (
                    <button
                      key={action.text}
                      className={`w-full flex items-center gap-4 p-4 bg-${action.color}-50 rounded-xl hover:bg-${action.color}-100 transition-all duration-300 transform hover:translate-x-2 group border border-${action.color}-200`}
                    >
                      <div className={`w-10 h-10 bg-${action.color}-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{action.text}</h3>
                        <p className="text-sm text-gray-600">{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border-2 border-yellow-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  This Month's Insights
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Student Engagement</span>
                      <span className="text-green-600 font-bold">92% ↗</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Course Completion</span>
                      <span className="text-blue-600 font-bold">87% ↗</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Student Satisfaction</span>
                      <span className="text-purple-600 font-bold">4.9/5 ⭐</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '98%'}}></div>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-6 text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium">
                    <FaTrophy />
                    Excellent work! Keep inspiring! 🌟
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorDashboard;

