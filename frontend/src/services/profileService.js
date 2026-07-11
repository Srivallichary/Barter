import api from "./api";

// ============================================================
// Profile Service — Real API endpoints
// ============================================================

export const profileService = {
  // ──────────────────────────────────────────────
  // REAL API: GET /api/users/profile
  // Returns the authenticated user's profile
  // ──────────────────────────────────────────────
  getProfile: async () => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: GET /api/users/ratings
  // Returns the authenticated user's trade ratings
  // ──────────────────────────────────────────────
  getRatings: async () => {
    const res = await api.get("/users/ratings");
    return res.data;
  },
};

export default profileService;
