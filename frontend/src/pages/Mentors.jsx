// Mentors listing page for MentorNest with modern cards and animations
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGlobe, FaGraduationCap, FaLinkedin, FaSearch, FaTimes, FaUsers } from "react-icons/fa";
import { getAllMentors } from "../services/mentorService";

const mentorColors = [
  "bg-blue-500", "bg-pink-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-indigo-500"
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
      <div className="flex justify-center items-center min-h-[40vh] bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <FaUsers className="text-6xl mx-auto mb-4 text-gray-400" />
        <p className="text-xl">No mentors available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Our Mentors</h1>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-full px-5 py-2 pl-10 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 shadow-sm"
            />
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredMentors.map((mentor, idx) => (
            <motion.div 
              key={mentor.id} 
              variants={fadeIn} 
              initial="hidden" 
              animate="visible" 
              custom={idx + 1}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
              onClick={() => handleMentorClick(mentor)}
            >
              {/* Mentor Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {mentor.imageUrl ? (
                  <img 
                    src={mentor.imageUrl} 
                    alt={mentor.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <FaUsers className="text-white text-4xl" />
                  </div>
                )}
              </div>

              {/* Mentor Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{mentor.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{mentor.expertise}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{mentor.bio}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-blue-500" />
                    <span className="text-sm text-gray-600">{mentor.coursesCount || 0} courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-green-500" />
                    <span className="text-sm text-gray-600">{mentor.studentsCount || 0} students</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-3">
                  {mentor.linkedinUrl && (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLinkedin className="text-xl" />
                    </a>
                  )}
                  {mentor.websiteUrl && (
                    <a
                      href={mentor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGlobe className="text-xl" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedMentor.name}</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {selectedMentor.imageUrl ? (
                  <img 
                    src={selectedMentor.imageUrl} 
                    alt={selectedMentor.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                  />
                ) : (
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaUsers className="text-white text-2xl" />
                  </div>
                )}
                <div>
                  <p className="text-blue-600 font-semibold text-lg">{selectedMentor.expertise}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <FaGraduationCap className="text-blue-500" />
                      <span className="text-sm text-gray-600">{selectedMentor.coursesCount || 0} courses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers className="text-green-500" />
                      <span className="text-sm text-gray-600">{selectedMentor.studentsCount || 0} students</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed">{selectedMentor.bio}</p>
              </div>

              <div className="flex space-x-3">
                {selectedMentor.linkedinUrl && (
                  <a
                    href={selectedMentor.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaLinkedin />
                    LinkedIn
                  </a>
                )}
                {selectedMentor.websiteUrl && (
                  <a
                    href={selectedMentor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FaGlobe />
                    Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Mentors; 