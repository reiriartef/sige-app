import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("sige-auth");
  if (raw) {
    try {
      const { state } = JSON.parse(raw);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

// On 401, clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sige-auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
