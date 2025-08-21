import api from "./api";

// Login user
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// Register user
export async function register({ name, email, password, role }) {
  const res = await api.post("/auth/register", { name, email, password, role });
  return res.data;
}

// Refresh token
export async function refreshToken(refreshToken) {
  const res = await api.post("/auth/refresh", null, { params: { refreshToken } });
  return res.data;
} 