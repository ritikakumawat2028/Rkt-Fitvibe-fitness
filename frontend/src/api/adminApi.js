// frontend/src/admin/adminApi.js
import axios from "axios";

// ✅ Create a dedicated Axios instance for all admin endpoints
const ADMIN_API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/admin` : "http://localhost:5000/api/admin",
  timeout: 10000, // optional but recommended (10s)
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
      console.warn("[AdminAPI] No token found. Request will likely fail with 401.");
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
    // Log the full error for debugging
    console.error("[AdminAPI] Response interceptor error:", error.response || error);

    // Handle token expiration or unauthorized access
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("[AdminAPI] Token invalid or expired. Clearing storage and redirecting.");

      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin"); // if you store admin info

      // Redirect to login page (avoid infinite loop)
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    // Always reject to allow UI components to handle errors
    return Promise.reject(error);
  }
);

// ----------------------
// API ENDPOINT FUNCTIONS
// ----------------------

// 🔹 Login Admin (POST /api/admin/login)
export const loginAdmin = (formData) => ADMIN_API.post("/login", formData);

// 🔹 Users
export const getUsers = (page = 1, limit = 10, query = "") =>
  ADMIN_API.get("/users", { params: { page, limit, q: query } });
export const getUserById = (id) => ADMIN_API.get(`/users/${id}`);
export const updateUserById = (id, userData) => ADMIN_API.put(`/users/${id}`, userData);
export const deleteUserById = (id) => ADMIN_API.delete(`/users/${id}`);

// 🔹 Admin dashboard stats
export const getAdminStats = () => ADMIN_API.get('/dashboard/stats');

// 🔹 Trainers (Admin)
export const getTrainers = () => ADMIN_API.get('/trainers');
export const createTrainer = (data) => ADMIN_API.post('/trainers', data);
export const updateTrainer = (id, data) => ADMIN_API.put(`/trainers/${id}`, data);
export const deleteTrainer = (id) => ADMIN_API.delete(`/trainers/${id}`);

export default ADMIN_API;
