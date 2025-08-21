import { motion } from 'framer-motion';
import React from 'react';
import { 
  FaGlobe, 
  FaHeart, 
  FaLightbulb, 
  FaLinkedin, 
  FaRocket, 
  FaUsers, 
  FaGraduationCap,
  FaCode,
  FaMountain,
  FaStar,
  FaHandshake,
  FaGem,
  FaFire,
  FaCompass
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: "Sai Sujan",
      role: "CEO & Founder",
      image: "/team/sai-sujan.png",
      linkedin: "https://linkedin.com/in/sai-sujan",
      bio: "Visionary leader passionate about democratizing education through technology",
      color: "from-blue-500 to-purple-600",
      skills: ["Leadership", "Strategy", "Innovation"]
    },
    {
      name: "Pavani Sathwik",
      role: "CTO",
      image: "/team/p-sathwik.png",
      linkedin: "https://linkedin.com/in/sathwik-reddy",
      bio: "Tech enthusiast crafting seamless user experiences with cutting-edge solutions",
      color: "from-pink-500 to-red-500",
      skills: ["React", "UI/UX", "Frontend"]
    },
    {
      name: "Srungarakavi Siddartha",
      role: "Lead Developer",
      image: "/team/siddartha.png",
      linkedin: "https://linkedin.com/in/siddhu-kumar",
      bio: "Backend architect building robust, scalable systems for global learners",
      color: "from-green-500 to-teal-500",
      skills: ["Java", "Spring Boot", "Architecture"]
    }
  ];

  const values = [
    {
      icon: <FaRocket className="text-4xl" />,
      title: "Innovation First",
      description: "We constantly push boundaries to deliver cutting-edge learning experiences that inspire and transform.",
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Global Community",
      description: "Building a supportive network of learners and mentors worldwide, fostering connections that last a lifetime.",
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FaLightbulb className="text-4xl" />,
      title: "Excellence Always",
      description: "Committed to providing the highest quality education and mentorship, setting new standards in online learning.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <FaHeart className="text-4xl" />,
      title: "Passion Driven",
      description: "Fueled by our love for education and helping others succeed, we turn learning into an exciting adventure.",
      color: "from-pink-400 to-red-500",
      bgColor: "bg-pink-50"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: <FaUsers />, color: "text-blue-600" },
    { number: "2K+", label: "Expert Mentors", icon: <FaGraduationCap />, color: "text-purple-600" },
    { number: "100+", label: "Courses", icon: <FaCode />, color: "text-green-600" },
    { number: "95%", label: "Success Rate", icon: <FaStar />, color: "text-yellow-600" }
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Beginning",
      description: "Founded with a vision to revolutionize online mentorship",
      icon: <FaRocket />,
      color: "from-blue-500 to-purple-600"
    },
    {
      year: "2023",
      title: "First 1000 Students",
      description: "Reached our first milestone with amazing community response",
      icon: <FaUsers />,
      color: "from-green-500 to-teal-600"
    },
    {
      year: "2024",
      title: "Platform 2.0",
      description: "Launched enhanced features with AI-powered mentorship matching",
      icon: <FaGem />,
      color: "from-purple-500 to-pink-600"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Serving students and mentors across 50+ countries worldwide",
      icon: <FaGlobe />,
      color: "from-orange-500 to-red-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-4 h-4 rounded-full opacity-20 ${
        i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-yellow-400'
      }`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, Math.random() * 20 - 10, 0]
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <FaGraduationCap className="text-white text-4xl" />
            </motion.div>
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
              About MentorNest
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              We're on a mission to make quality education and mentorship accessible to everyone, everywhere. 
              Transforming dreams into achievements through personalized learning experiences! 🚀
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className={`text-5xl mb-4 ${stat.color}`}
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {stat.icon}
                </motion.div>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600/5 to-blue-600/5">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From a simple idea to a global platform empowering thousands of learners
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full hidden lg:block"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-1">
                    <motion.div 
                      className={`p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 ${
                        index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                      }`}
                    >
                      <div className={`inline-block px-4 py-2 bg-gradient-to-r ${milestone.color} text-white rounded-full text-sm font-bold mb-4`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center text-white text-2xl shadow-xl z-10 relative`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {milestone.icon}
                  </motion.div>
                  
                  <div className="flex-1 lg:block hidden"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={`p-8 ${value.bgColor} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/80`}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
              Meet Our Amazing Team
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              The passionate innovators making education accessible worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="group"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 text-center">
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-32 h-32 bg-gradient-to-br ${member.color} rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-2xl`}>
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUsers className="text-white text-4xl" />
                      )}
                    </div>
                    <motion.div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FaLinkedin className="text-blue-600 text-xl" />
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${member.color} text-white rounded-full text-sm font-bold mb-4`}>
                    {member.role}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    to={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block mt-6 px-6 py-3 bg-gradient-to-r ${member.color} text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    Connect on LinkedIn
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
            variants={itemVariants}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern id="cta-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="white"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaCompass className="text-white text-2xl" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of learners who have transformed their careers with MentorNest. 
                Your success story starts here! 🌟
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started Today
                </Link>
                <Link
                  to="/courses"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
