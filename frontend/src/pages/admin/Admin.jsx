import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Admin = () => {
  return (
    <div className="min-h-screen flex bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin; 