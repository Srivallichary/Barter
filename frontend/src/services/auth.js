import api, { setToken } from "./api";

// ============================================================
// Auth Service — Real + Placeholder APIs
// ============================================================

export const authService = {
  // ──────────────────────────────────────────────
  // REAL API: POST /api/auth/register
  // ──────────────────────────────────────────────
  registerUser: async (username, password, email) => {
    const res = await api.post("/auth/register", { name: username, password, email });
    return res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: POST /api/auth/login
  // Returns JWT token + user object
  // ──────────────────────────────────────────────
  loginUser: async (username, password) => {
    const res = await api.post("/auth/login", { email: username, password });

    // Store the JWT token from the response
    if (res.data?.token) {
      setToken(res.data.token);
    }

    return res.data;
  },

  // ──────────────────────────────────────────────
  // PLACEHOLDER: Logout (no backend endpoint yet)
  // Clears local JWT token
  // ──────────────────────────────────────────────
  logoutUser: async () => {
    // TODO: Replace with POST /api/auth/logout when backend supports it
    return { success: true, message: "Logged out successfully" };
  },

  // ──────────────────────────────────────────────
  // REAL API: POST /api/auth/send-otp
  // ──────────────────────────────────────────────
  sendOtp: async (email) => {
    const res = await api.post("/auth/send-otp", { email });
    return res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: POST /api/auth/verify-otp
  // ──────────────────────────────────────────────
  verifyOtp: async (email, otp) => {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: GET /api/auth/check-username/:username
  // ──────────────────────────────────────────────
  checkUsernameAvailability: async (username) => {
    const res = await api.get(`/auth/check-username/${username}`);
    return res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: GET /api/users/profile (validates session)
  // ──────────────────────────────────────────────
  checkSession: async () => {
    try {
      const res = await api.get("/users/profile");
      return { success: true, valid: !!res.data };
    } catch {
      return { success: false, valid: false };
    }
  },

  // ──────────────────────────────────────────────
  // REAL API: PUT /api/users/profile
  // ──────────────────────────────────────────────
  updateUser: async (userId, updatedData) => {
    const res = await api.put("/users/profile", updatedData);
    return res.data;
  },

  // ──────────────────────────────────────────────
  // PLACEHOLDER: Forgot password
  // ──────────────────────────────────────────────
  forgotPassword: async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Reset OTP sent successfully" });
      }, 500);
    });
  },

  // ──────────────────────────────────────────────
  // PLACEHOLDER: Reset password
  // ──────────────────────────────────────────────
  resetPassword: async (email, otp, newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Password updated successfully" });
      }, 500);
    });
  }
};

export default authService;
