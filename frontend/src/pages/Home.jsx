// Creative Educational Platform Homepage - MentorNest
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { 
  FaBookOpen, 
  FaChalkboardTeacher, 
  FaCheckCircle, 
  FaGraduationCap, 
  FaHeart,
  FaLightbulb, 
  FaRocket, 
  FaStar, 
  FaUsers,
  FaAward,
  FaTrophy,
  FaRegSmile,
  FaPlay,
  FaArrowRight
} from "react-icons/fa";
import { Link } from "react-router-dom";

const featuredMentors = [
  { 
    name: "Dr. Sarah Chen", 
    expertise: "AI & Machine Learning", 
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.9,
    students: 2840,
    badge: "Top Mentor"
  },
  { 
    name: "Marcus Johnson", 
    expertise: "Full Stack Development", 
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    students: 1950,
    badge: "Expert"
  },
  { 
    name: "Priya Sharma", 
    expertise: "UI/UX Design", 
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.9,
    students: 3200,
    badge: "Design Pro"
  },
  { 
    name: "David Rodriguez", 
    expertise: "Data Science", 
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4.7,
    students: 1680,
    badge: "Analytics Expert"
  }
];

const successStories = [
  {
    name: "Emma Wilson",
    role: "Software Engineer at Google",
    story: "From beginner to tech giant in 8 months!",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
    achievement: "Career Switch"
  },
  {
    name: "Alex Turner",
    role: "Product Manager at Microsoft",
    story: "Doubled my salary with new skills!",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    achievement: "Promotion"
  },
  {
    name: "Lisa Park",
    role: "UX Designer at Meta",
    story: "Transformed my creative passion into career!",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    achievement: "Dream Job"
  }
];

const platformStats = [
  { icon: FaUsers, value: "50K+", label: "Active Learners", color: "text-blue-500" },
  { icon: FaChalkboardTeacher, value: "1200+", label: "Expert Mentors", color: "text-orange-500" },
  { icon: FaBookOpen, value: "800+", label: "Courses", color: "text-teal-500" },
  { icon: FaAward, value: "25K+", label: "Certificates", color: "text-purple-500" }
];

const features = [
  {
    icon: FaLightbulb,
    title: "Interactive Learning",
    description: "Engage with hands-on projects and real-world scenarios",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50"
  },
  {
    icon: FaUsers,
    title: "Community Support",
    description: "Connect with peers and mentors worldwide",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    icon: FaTrophy,
    title: "Achievements",
    description: "Earn certificates and showcase your skills",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    icon: FaRocket,
    title: "Career Growth",
    description: "Accelerate your professional development",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % successStories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Creative Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-teal-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
          <div className="absolute bottom-20 right-10 w-18 h-18 bg-yellow-200 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        </div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3B82F6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="space-y-8"
          >
            {/* Main Logo/Icon */}
            <motion.div 
              variants={fadeIn}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <FaGraduationCap className="text-white text-4xl" />
                </motion.div>
                <motion.div 
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaLightbulb className="text-white text-sm" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={fadeIn} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600">
                  MentorNest
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium flex items-center justify-center gap-2">
                Where Learning Meets Innovation 
                <motion.span
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your future with personalized mentorship, expert-led courses, and a supportive community of learners. Start your journey to success today! 
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                🚀
              </motion.span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            >
              <Link 
                to="/courses" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaPlay className="group-hover:animate-pulse" />
                Start Learning Now
              </Link>
              <Link 
                to="/mentors" 
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold transform hover:scale-105 flex items-center gap-2"
              >
                Meet Our Mentors
                <FaArrowRight className="text-sm" />
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div 
              variants={fadeIn}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
            >
              {platformStats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg mb-3 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-xl" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-blue-400 rounded-full mt-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> MentorNest</span>?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience learning like never before with our innovative approach to education and mentorship
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className={`${feature.bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}
              >
                <div className={`w-16 h-16 ${feature.color} bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Mentors Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Meet Our 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600"> Star Mentors</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Learn from industry experts who are passionate about sharing their knowledge and helping you succeed
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredMentors.map((mentor, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="mentor-card p-6 text-center"
                whileHover={{ y: -10 }}
              >
                <div className="relative mb-6">
                  <img 
                    src={mentor.img} 
                    alt={mentor.name} 
                    className="w-24 h-24 rounded-full mx-auto shadow-lg border-4 border-white"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs font-semibold rounded-full">
                      {mentor.badge}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{mentor.name}</h3>
                <p className="text-gray-600 mb-4">{mentor.expertise}</p>
                
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-sm" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">({mentor.rating})</span>
                </div>
                
                <p className="text-sm text-gray-500">
                  <FaUsers className="inline mr-1" />
                  {mentor.students.toLocaleString()} students
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Link 
              to="/mentors" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All Mentors
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Success 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600"> Stories</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Real students, real results. See how MentorNest has transformed careers and dreams into reality
            </motion.p>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-blue-500"></div>
            
            <div className="flex items-center justify-center mb-8">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full mx-2 transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>

            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <img 
                src={successStories[currentTestimonial].image} 
                alt={successStories[currentTestimonial].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-gradient-to-r from-teal-500 to-blue-500 shadow-lg"
              />
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {successStories[currentTestimonial].name}
              </h3>
              <p className="text-gray-600 mb-4">
                {successStories[currentTestimonial].role}
              </p>
              <p className="text-xl text-gray-700 italic mb-6">
                "{successStories[currentTestimonial].story}"
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full">
                <FaTrophy className="text-teal-600" />
                <span className="text-teal-700 font-semibold">
                  {successStories[currentTestimonial].achievement}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div variants={fadeIn} className="mb-8">
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaHeart className="text-white text-2xl" />
                </motion.div>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Transform Your Future?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Join over 50,000 learners who are already building their dream careers with MentorNest
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/register" 
                className="group px-8 py-4 bg-white text-blue-600 rounded-full shadow-xl text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaRocket className="group-hover:animate-bounce" />
                Get Started Free
              </Link>
              <Link 
                to="/courses" 
                className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold transform hover:scale-105 flex items-center gap-2"
              >
                Explore Courses
                <FaArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
