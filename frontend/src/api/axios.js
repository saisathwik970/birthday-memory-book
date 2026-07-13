import axios from "axios";

// In development, Vite proxies "/api" to localhost:5000 (see vite.config.js), so the
// relative path works. In production, the frontend (S3/Vercel) and backend (Render/EC2) live on
// different domains, so we need the full backend URL. Set VITE_API_URL in a `.env` file
// (frontend/.env) or in your hosting provider's environment variables, e.g.:
//   VITE_API_URL=https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // send the httpOnly JWT cookie
});

// Redirect to login on 401s (session expired), except during the login/me check itself
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes("/auth/")) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;