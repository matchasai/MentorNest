import React from "react";
import { motion } from "framer-motion";
import { 
  FaFacebook, 
  FaGithub, 
  FaGraduationCap, 
  FaHeart, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope,
  FaRocket,
  FaStar,
  FaLightbulb
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Browse Courses", href: "/courses" },
      { label: "Find Mentors", href: "/mentors" },
      { label: "About Us", href: "/about" },
      { label: "Success Stories", href: "/success-stories" }
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Community", href: "/community" },
      { label: "FAQ", href: "/faq" }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" }
    ]
  };

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com/mentornest", label: "Facebook", color: "text-blue-500" },
    { icon: FaLinkedin, href: "https://linkedin.com/company/mentornest", label: "LinkedIn", color: "text-blue-600" },
    { icon: FaGithub, href: "https://github.com/mentornest", label: "GitHub", color: "text-gray-700" },
    { icon: FaTwitter, href: "https://twitter.com/mentornest", label: "Twitter", color: "text-blue-400" },
    { icon: FaEnvelope, href: "mailto:hello@mentornest.com", label: "Email", color: "text-green-500" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-300 mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-30"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-30"
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-30"
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <motion.div 
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div 
              variants={fadeIn}
              className="col-span-1 lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaGraduationCap className="text-white text-xl" />
                  </div>
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaRocket className="text-white text-xs" />
                  </motion.div>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white">MentorNest</h3>
                  <p className="text-blue-300 text-sm">Empowering Growth</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Transform your future with personalized mentorship and expert-led courses. Join thousands of learners on their journey to success! ✨
              </p>
              
              <div className="flex gap-2">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-400/30"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-yellow-300 text-sm font-medium">50K+ Students</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Platform Links */}
            <motion.div variants={fadeIn}>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400" />
                Platform
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-blue-300 transition-colors text-sm block py-1 hover:translate-x-1 transform transition-transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div variants={fadeIn}>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <FaHeart className="text-red-400" />
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-blue-300 transition-colors text-sm block py-1 hover:translate-x-1 transform transition-transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter & Social */}
            <motion.div variants={fadeIn}>
              <h3 className="text-white font-semibold mb-6">Stay Connected</h3>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">Get the latest updates and learning tips!</p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  />
                  <motion.button 
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-gray-400 text-sm mb-4">Follow us:</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center ${social.color} hover:bg-white/20 transition-all duration-300 hover:shadow-lg`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="text-lg" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>&copy; {currentYear} MentorNest. All rights reserved.</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-blue-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ 
                  color: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ef4444"],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaHeart className="text-red-500" />
              </motion.div>
              <span>for learners worldwide 🌍</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
