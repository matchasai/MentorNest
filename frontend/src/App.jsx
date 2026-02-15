import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import { useEffect, useState } from "react";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import MentorRoute from "./components/MentorRoute";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import Admin from "./pages/admin/Admin";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminMentors from "./pages/admin/AdminMentors";
import AdminModules from "./pages/admin/AdminModules";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStudentProgress from "./pages/admin/AdminStudentProgress";
import Certificates from "./pages/Certificates";
import Contact from "./pages/Contact";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MentorDashboard from "./pages/MentorDashboard";
import Mentors from "./pages/Mentors";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { setSessionExpiredHandler } from "./services/api";

const AppLayout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-teal-50 text-gray-900 font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/mentor" element={<MentorRoute><MentorDashboard /></MentorRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/certificates" element={<PrivateRoute><Certificates /></PrivateRoute>} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>}>
            <Route index element={<AdminAnalytics />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="mentors" element={<AdminMentors />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="modules" element={<AdminModules />} />
            <Route path="student-progress" element={<AdminStudentProgress />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    setSessionExpiredHandler(() => () => setSessionExpired(true));
  }, []);

  const handleSessionModalClose = () => {
    setSessionExpired(false);
    window.location.href = "/login";
  };

  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" toastOptions={{
          className: '',
          style: {
            margin: '12px',
            background: '#333',
            color: '#fff',
            zIndex: 9999
          },
        }} />
        <AppLayout />
        <Modal open={sessionExpired} onClose={handleSessionModalClose} title="Session Expired">
          Your session has expired. Please login again.
          <button onClick={handleSessionModalClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">Login</button>
        </Modal>
      </Router>
    </AuthProvider>
  );
};

export default App;
