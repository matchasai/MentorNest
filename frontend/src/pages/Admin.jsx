// Admin panel layout for Online Mentorship Platform
import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminCourses from "./admin/AdminCourses";
import AdminMentors from "./admin/AdminMentors";
import AdminUsers from "./admin/AdminUsers";

const AdminLayout = () => (
  <div className="flex min-h-[70vh]">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-50">
      <Outlet />
    </div>
  </div>
);

const Admin = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<Navigate to="users" replace />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="mentors" element={<AdminMentors />} />
      <Route path="courses" element={<AdminCourses />} />
    </Route>
  </Routes>
);

export default Admin; 