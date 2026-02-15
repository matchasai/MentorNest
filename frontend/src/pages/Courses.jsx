// Enhanced Courses listing page for MentorNest with modern cards and animations
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaClock, FaGraduationCap, FaSearch, FaStar, FaUser, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getCourses } from "../services/courseService";

const mentorColors = [
  "bg-gradient-to-br from-blue-500 to-blue-600", 
  "bg-gradient-to-br from-pink-500 to-pink-600", 
  "bg-gradient-to-br from-green-500 to-green-600", 
  "bg-gradient-to-br from-yellow-500 to-yellow-600", 
  "bg-gradient-to-br from-purple-500 to-purple-600", 
  "bg-gradient-to-br from-indigo-500 to-indigo-600"
];

const difficultyColors = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200", 
  advanced: "bg-red-100 text-red-700 border-red-200"
};

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, type: "spring" },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => {
        setError("Failed to load courses");
        toast.error("Failed to load courses");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", "web development", "mobile development", "data science", "design", "business"];

  const filtered = courses.filter(
    (c) => {
      const matchesSearch = (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
                           (c.mentorName || "").toLowerCase().includes(search.toLowerCase()) ||
                           (c.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
                             (c.title || "").toLowerCase().includes(selectedCategory.toLowerCase()) ||
                             (c.description || "").toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-300 border-t-transparent animate-ping mx-auto"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Discovering amazing courses for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center mt-20">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center mt-20">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No courses available yet</h2>
          <p className="text-gray-600">Check back soon for exciting new courses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto py-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Explore Our Courses
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover world-class learning experiences designed by expert mentors to accelerate your career
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by course, mentor, or topic..."
                className="w-full pl-12 pr-4 py-4 text-gray-800 bg-white rounded-2xl border-0 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 shadow-xl text-lg"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 text-center"
        >
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-blue-600">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''} found
            {search && <span> for "<span className="font-semibold">{search}</span>"</span>}
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((course, idx) => (
            <motion.div 
              key={course.id} 
              variants={fadeIn} 
              custom={idx + 1}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to={`/course/${course.id}`}>
                <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                  {/* Course Image with Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${course.imageUrl ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 items-center justify-center relative`}>
                      <div className="text-white text-4xl font-bold">
                        {course.title ? course.title.split(" ").map(word => word[0]).join("").substring(0, 3) : "???"}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <span className="text-blue-600 font-bold text-lg">₹{course.price}</span>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors.beginner}`}>
                        Beginner
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Mentor Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {course.mentorImageUrl ? (
                        <img 
                          src={course.mentorImageUrl} 
                          alt={course.mentorName}
                          className="w-12 h-12 rounded-full object-cover shadow-lg border-3 border-white ring-2 ring-blue-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ${mentorColors[idx % mentorColors.length]} ${course.mentorImageUrl ? 'hidden' : ''}`}>
                        {course.mentorName ? course.mentorName.split(" ").map(n => n[0]).join("") : "?"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 text-sm">{course.mentorName || "Unknown Mentor"}</span>
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          Expert Mentor
                        </span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {course.title || "Untitled Course"}
                    </h2>

                    {/* Course Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {course.description || "No description available."}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaGraduationCap className="w-4 h-4" />
                          <span>12 modules</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaClock className="w-4 h-4" />
                          <span>24h</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar className="w-4 h-4" />
                        <span className="text-gray-600 font-semibold">4.8</span>
                      </div>
                    </div>

                    {/* Enrollment Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <FaUsers className="w-4 h-4" />
                        <span>245+ enrolled</span>
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-blue-700 transition-colors">
                        Enroll Now
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or category filter</p>
            <button 
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses; 