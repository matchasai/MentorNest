// Sidebar component for Admin Panel navigation
import React from "react";
import { FaBook, FaBookOpen, FaUsers, FaUserTie } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClasses = "flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors";
  const activeLinkClasses = "bg-blue-600 text-white shadow-md";

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col shadow-lg">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-wider">Admin Panel</h2>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin/users" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaUsers />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/mentors" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaUserTie />
          <span>Mentors</span>
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaBookOpen />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/admin/modules" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaBook />
          <span>Modules</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar; 