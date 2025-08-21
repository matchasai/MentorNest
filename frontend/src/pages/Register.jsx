// Register page for MentorNest with modern form
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { register as registerApi } from "../services/authService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await registerApi({ name, email, password, role: "STUDENT" });
      login(data.token);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Register for MentorNest</h1>
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            type="text"
            className="peer w-full border border-gray-300 rounded-full px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
            placeholder=" "
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all
            peer-placeholder-shown:text-base
            peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600
            peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-600
            bg-white px-1">Name</label>
        </div>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            type="email"
            className="peer w-full border border-gray-300 rounded-full px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder=" "
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all
            peer-placeholder-shown:text-base
            peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600
            peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-600
            bg-white px-1">Email</label>
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            type="password"
            className="peer w-full border border-gray-300 rounded-full px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder=" "
          />
          <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-all
            peer-placeholder-shown:text-base
            peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600
            peer-[:not([placeholder-shown])]:-top-3 peer-[:not([placeholder-shown])]:text-xs peer-[:not([placeholder-shown])]:text-blue-600
            bg-white px-1">Password</label>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register; 