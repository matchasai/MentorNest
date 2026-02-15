import React, { useEffect, useState } from "react";
import {
    FaBook,
    FaChalkboardTeacher,
    FaChartLine,
    FaCheckCircle,
    FaClipboardList,
    FaClock,
    FaLayerGroup,
    FaPlayCircle,
    FaStar,
    FaTrophy,
    FaUserGraduate,
    FaUsers,
    FaUserShield
} from "react-icons/fa";
import StudentProgressTable from "../../components/StudentProgressTable";
import WelcomeAnimation from "../../components/WelcomeAnimation";
import api from "../../services/api";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const userName = "Sai";

  useEffect(() => {
    api.get("/admin/analytics")
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-gray-300">Loading dashboard...</div>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="text-center text-red-500 py-12">
      <FaUserShield className="text-6xl mx-auto mb-4 text-red-400" />
      <div className="text-xl">Failed to load analytics.</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Welcome Section */}
      <WelcomeAnimation userName={userName} />

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-white text-3xl font-bold">{stats.totalUsers || 0}</p>
              <p className="text-blue-200 text-xs mt-1">Active learners</p>
            </div>
            <FaUsers className="text-white text-3xl" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Students</p>
              <p className="text-white text-3xl font-bold">{stats.totalStudents || 0}</p>
              <p className="text-green-200 text-xs mt-1">Enrolled learners</p>
            </div>
            <FaUserGraduate className="text-white text-3xl" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Mentors</p>
              <p className="text-white text-3xl font-bold">{stats.totalMentors || 0}</p>
              <p className="text-purple-200 text-xs mt-1">Expert teachers</p>
            </div>
            <FaChalkboardTeacher className="text-white text-3xl" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Courses</p>
              <p className="text-white text-3xl font-bold">{stats.totalCourses || 0}</p>
              <p className="text-yellow-200 text-xs mt-1">Available courses</p>
            </div>
            <FaBook className="text-white text-3xl" />
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Distribution */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-400" />
            User Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FaUserGraduate className="text-green-400 text-xl" />
                <span className="text-gray-300">Students</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{stats.totalStudents || 0}</div>
                <div className="text-green-400 text-sm">
                  {stats.totalUsers ? Math.round((stats.totalStudents / stats.totalUsers) * 100) : 0}%
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FaChalkboardTeacher className="text-purple-400 text-xl" />
                <span className="text-gray-300">Mentors</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{stats.totalMentors || 0}</div>
                <div className="text-purple-400 text-sm">
                  {stats.totalUsers ? Math.round((stats.totalMentors / stats.totalUsers) * 100) : 0}%
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FaUserShield className="text-blue-400 text-xl" />
                <span className="text-gray-300">Admins</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{stats.totalAdmins || 1}</div>
                <div className="text-blue-400 text-sm">
                  {stats.totalUsers ? Math.round((stats.totalAdmins / stats.totalUsers) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Analytics */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
            <FaBook className="text-yellow-400" />
            Course Analytics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FaBook className="text-yellow-400 text-xl" />
                <span className="text-gray-300">Total Courses</span>
              </div>
              <div className="text-white font-bold">{stats.totalCourses || 0}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FaLayerGroup className="text-purple-400 text-xl" />
                <span className="text-gray-300">Total Modules</span>
              </div>
              <div className="text-white font-bold">{stats.totalModules || 0}</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FaClipboardList className="text-green-400 text-xl" />
                <span className="text-gray-300">Total Enrollments</span>
              </div>
              <div className="text-white font-bold">{stats.totalEnrollments || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Progress Section */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
        <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
          <FaTrophy className="text-yellow-400" />
          Student Progress Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <FaPlayCircle className="text-blue-400 text-2xl mx-auto mb-2" />
            <div className="text-white font-bold text-xl">{stats.activeStudents || 0}</div>
            <div className="text-gray-400 text-sm">Active Students</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <FaCheckCircle className="text-green-400 text-2xl mx-auto mb-2" />
            <div className="text-white font-bold text-xl">{stats.completedCourses || 0}</div>
            <div className="text-gray-400 text-sm">Completed Courses</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <FaClock className="text-yellow-400 text-2xl mx-auto mb-2" />
            <div className="text-white font-bold text-xl">{stats.inProgressCourses || 0}</div>
            <div className="text-gray-400 text-sm">In Progress</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <FaStar className="text-purple-400 text-2xl mx-auto mb-2" />
            <div className="text-white font-bold text-xl">{stats.certificatesIssued || 0}</div>
            <div className="text-gray-400 text-sm">Certificates Issued</div>
          </div>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="mt-8">
        <StudentProgressTable />
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
        <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
          <FaChartLine className="text-green-400" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">New student enrolled in "Frontend Development"</span>
            <span className="text-gray-500 text-sm ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">Course "Backend Development" completed by student</span>
            <span className="text-gray-500 text-sm ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-300">New mentor "John Doe" joined the platform</span>
            <span className="text-gray-500 text-sm ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 