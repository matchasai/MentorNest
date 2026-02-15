// Enhanced Mentors listing page with modern glassmorphism design
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGlobe, FaGraduationCap, FaLinkedin, FaSearch, FaStar, FaTimes, FaUsers } from "react-icons/fa";
import { getAllMentors } from "../services/mentorService";

const mentorGradients = [
  "from-blue-500 via-blue-600 to-indigo-600",
  "from-purple-500 via-purple-600 to-pink-600",
  "from-green-500 via-emerald-600 to-teal-600",
  "from-orange-500 via-amber-600 to-yellow-600",
  "from-pink-500 via-rose-600 to-red-600",
  "from-indigo-500 via-violet-600 to-purple-600"
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, type: "spring" },
  }),
};

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const data = await getAllMentors();
      setMentors(data);
    } catch (error) {
      console.error("Error loading mentors:", error);
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative flex justify-center items-center mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-300 border-t-transparent animate-ping"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading amazing mentors...</p>
        </div>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FaUsers className="text-6xl mx-auto mb-4 text-gray-400" />
          <p className="text-2xl font-semibold text-gray-800">No mentors available yet.</p>
          <p className="text-gray-600 mt-2">Check back soon for expert mentors!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Meet Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Expert Mentors</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Learn from industry professionals with years of real-world experience
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative">
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg z-10" />
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-14 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </motion.div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor, idx) => (
            <motion.div 
              key={mentor.id} 
              variants={fadeIn} 
              initial="hidden" 
              animate="visible" 
              custom={idx + 1}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleMentorClick(mentor)}
            >
              {/* Gradient Background Header */}
              <div className={`relative h-40 bg-gradient-to-br ${mentorGradients[idx % mentorGradients.length]} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                
                {/* Mentor Image */}
                <div className="relative z-10">
                  {mentor.imageUrl ? (
                    <div className="relative">
                      <img 
                        src={mentor.imageUrl} 
                        alt={mentor.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <FaStar className="text-white text-xs" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <FaUsers className="text-white text-3xl" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Mentor Name */}
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2 group-hover:text-blue-600 transition-colors">
                  {mentor.name || "Mentor"}
                </h3>

                {/* Expertise */}
                <p className="text-blue-600 font-semibold text-center mb-4 line-clamp-2 min-h-[3rem] text-sm">
                  {mentor.expertise || "Expert Mentor"}
                </p>

                {/* Bio */}
                <p className="text-gray-600 text-sm text-center mb-6 line-clamp-3 min-h-[4.5rem] leading-relaxed">
                  {mentor.bio || "Experienced professional dedicated to mentoring and guiding students."}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-around mb-6 bg-gray-50 rounded-xl py-3 px-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FaGraduationCap className="text-blue-500 text-lg" />
                      <span className="text-gray-800 font-bold text-lg">{mentor.coursesCount || 0}</span>
                    </div>
                    <span className="text-gray-500 text-xs">Courses</span>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FaUsers className="text-green-500 text-lg" />
                      <span className="text-gray-800 font-bold text-lg">{mentor.studentsCount || 0}</span>
                    </div>
                    <span className="text-gray-500 text-xs">Students</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 mb-4">
                  {mentor.linkedinUrl && (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLinkedin className="text-lg" />
                    </a>
                  )}
                  {mentor.websiteUrl && (
                    <a
                      href={mentor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-110"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGlobe className="text-lg" />
                    </a>
                  )}
                </div>

                {/* View Details Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredMentors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-800 text-xl mb-2">No mentors found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-blue-600 hover:text-blue-700 underline font-semibold"
            >
              Clear search
            </button>
          </motion.div>
        )}
      </div>

      {/* Enhanced Mentor Detail Modal */}
      {selectedMentor && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-t-3xl">
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors bg-white/20 hover:bg-white/30 rounded-full p-2"
              >
                <FaTimes className="text-xl" />
              </button>
              
              <div className="flex items-center gap-6">
                {selectedMentor.imageUrl ? (
                  <img 
                    src={selectedMentor.imageUrl} 
                    alt={selectedMentor.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center border-4 border-white">
                    <FaUsers className="text-white text-3xl" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedMentor.name}</h2>
                  <p className="text-yellow-300 font-semibold text-lg mb-3">{selectedMentor.expertise}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <FaGraduationCap className="text-white" />
                      <span className="text-white font-semibold">{selectedMentor.coursesCount || 0} Courses</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <FaUsers className="text-white" />
                      <span className="text-white font-semibold">{selectedMentor.studentsCount || 0} Students</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  About {selectedMentor.name?.split(' ')[0] || 'Mentor'}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  {selectedMentor.bio || "An experienced professional dedicated to helping students achieve their goals through personalized mentorship and guidance."}
                </p>
              </div>

              {/* Experience Info */}
              {selectedMentor.experienceYears && (
                <div className="mb-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Experience</h3>
                  <p className="text-gray-700 text-lg">{selectedMentor.experienceYears}+ years in the industry</p>
                </div>
              )}

              {/* Connect Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Connect with {selectedMentor.name?.split(' ')[0] || 'Mentor'}</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedMentor.linkedinUrl && (
                    <a
                      href={selectedMentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                    >
                      <FaLinkedin className="text-xl" />
                      Connect on LinkedIn
                    </a>
                  )}
                  {selectedMentor.websiteUrl && (
                    <a
                      href={selectedMentor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                    >
                      <FaGlobe className="text-xl" />
                      Visit Website
                    </a>
                  )}
                  {!selectedMentor.linkedinUrl && !selectedMentor.websiteUrl && (
                    <p className="text-gray-600 italic">No social links available</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Mentors; 