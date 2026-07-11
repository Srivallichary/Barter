import axios from "axios";

// ============================================================
// Token Helpers
// ============================================================

const TOKEN_KEY = "barter_jwt_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ============================================================
// Centralized Axios Instance
// ============================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ============================================================
// Request Interceptor — attach JWT to every protected request
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Response Interceptor — normalize errors into user-friendly messages
// ============================================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (server unreachable)
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection and make sure the server is running.")
      );
    }

    const { status, data } = error.response;
    let message = data?.message || data?.error || "Something went wrong.";

    switch (status) {
      case 401:
        message = message || "Session expired. Please log in again.";
        // Clear stale token — but don't redirect here; let AuthContext handle it
        removeToken();
        break;
      case 403:
        message = "You do not have permission to perform this action.";
        break;
      case 404:
        message = message || "The requested resource was not found.";
        break;
      case 422:
        // Validation errors — keep the backend message as-is
        break;
      case 500:
        message = "Internal server error. Please try again later.";
        break;
      default:
        break;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
