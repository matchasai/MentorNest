import React, { useState } from "react";
import { FaBars, FaGraduationCap, FaUser, FaSignOutAlt, FaTimes, FaRocket, FaBookOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/mentors", label: "Mentors" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Main Navbar */}
      <motion.nav 
        className="w-full bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 shadow-2xl relative z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group" 
              onClick={closeMobileMenu}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaRocket className="text-white text-xs" />
                </motion.div>
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight group-hover:text-yellow-200 transition-colors">
                  MentorNest
                </span>
                <span className="text-xs text-blue-100 hidden sm:block group-hover:text-yellow-200 transition-colors">
                  Empowering Growth
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <motion.div key={link.to} whileHover={{ y: -2 }}>
                  <Link 
                    to={link.to} 
                    className="text-blue-50 hover:text-yellow-200 font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10 relative group"
                  >
                    {link.label}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"
                    />
                  </Link>
                </motion.div>
              ))}
              
              {!isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-blue-50 hover:text-yellow-200 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/register" 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Dashboard Links */}
                  {user?.role === "STUDENT" && (
                    <Link
                      to="/dashboard"
                      className="text-blue-50 hover:text-yellow-200 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
                    >
                      <FaBookOpen className="text-sm" />
                      Dashboard
                    </Link>
                  )}
                  
                  {user?.role === "MENTOR" && (
                    <Link
                      to="/mentor"
                      className="text-blue-50 hover:text-yellow-200 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
                    >
                      <FaGraduationCap className="text-sm" />
                      Mentor Portal
                    </Link>
                  )}

                  {user?.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="text-blue-50 hover:text-yellow-200 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      className="flex items-center gap-2 text-blue-50 hover:text-yellow-200 transition-colors p-2 rounded-lg hover:bg-white/10"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <span className="font-medium hidden lg:block">{user?.name}</span>
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border-2 border-blue-100 overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                            <p className="text-white font-semibold">{user?.name}</p>
                            <p className="text-blue-100 text-sm">{user?.email}</p>
                            <p className="text-blue-200 text-xs mt-1 capitalize">{user?.role?.toLowerCase()}</p>
                          </div>
                          
                          <div className="py-2">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={closeUserMenu}
                            >
                              <FaUser className="text-blue-500" />
                              Profile
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              <FaSignOutAlt className="text-red-500" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-blue-700 to-purple-800 z-50 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FaGraduationCap className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-white">MentorNest</span>
                      <p className="text-blue-200 text-sm">Empowering Growth</p>
                    </div>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="text-white hover:text-yellow-200 transition-colors p-2"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                {isAuthenticated && (
                  <>
                    {user?.role === "STUDENT" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navLinks.length * 0.1 }}
                      >
                        <Link
                          to="/dashboard"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                        >
                          Dashboard
                        </Link>
                      </motion.div>
                    )}
                    
                    {user?.role === "MENTOR" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navLinks.length * 0.1 }}
                      >
                        <Link
                          to="/mentor"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                        >
                          Mentor Portal
                        </Link>
                      </motion.div>
                    )}

                    {user?.role === "ADMIN" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navLinks.length * 0.1 }}
                      >
                        <Link
                          to="/admin"
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                        >
                          Admin Panel
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* User Section */}
              {isAuthenticated ? (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-blue-200 text-sm capitalize">{user?.role?.toLowerCase()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <FaUser />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block text-center px-6 py-3 text-blue-200 hover:text-white border border-blue-400 rounded-full font-medium transition-colors hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block text-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
