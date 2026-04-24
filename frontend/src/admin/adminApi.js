import axios from "axios";

// ✅ Create Axios instance for admin API
const ADMIN_API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/admin` : "http://localhost:5000/api/admin",
  timeout: 10000, // (optional) prevents hanging requests
});

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
ADMIN_API.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else {
      console.warn("[AdminAPI] No admin token found for request.");
    }
    return config;
  },
  (error) => {
    console.error("[AdminAPI] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
ADMIN_API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[AdminAPI] Response interceptor error:", error.response || error);

    // Handle unauthorized or expired token
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("[AdminAPI] Token invalid/expired. Clearing token & redirecting...");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");

      // Prevent redirect loop
      if (!window.location.pathname.endsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

// ----------------------
// ADMIN API FUNCTIONS
// ----------------------

// 🔹 Admin login
export const loginAdmin = (formData) => ADMIN_API.post("/login", formData);

// 🔹 Users
export const getUsers = (page = 1, limit = 10, query = "") =>
  ADMIN_API.get("/users", { params: { page, limit, q: query } });
export const getUserById = (id) => ADMIN_API.get(`/users/${id}`);
export const updateUserById = (id, userData) => ADMIN_API.put(`/users/${id}`, userData);
export const deleteUserById = (id) => ADMIN_API.delete(`/users/${id}`);

// 🔹 Trainers (Admin)
export const getTrainers = () => ADMIN_API.get('/trainers');
export const createTrainer = (data) => ADMIN_API.post('/trainers', data);
export const updateTrainer = (id, data) => ADMIN_API.put(`/trainers/${id}`, data);
export const deleteTrainer = (id) => ADMIN_API.delete(`/trainers/${id}`);

// 🔹 Get recent activity (for dashboard)
export const getRecentActivity = () => ADMIN_API.get('/activity/recent-users');

// 🔹 Admin dashboard stats
export const getAdminStats = () => ADMIN_API.get('/dashboard/stats');

export default ADMIN_API;

