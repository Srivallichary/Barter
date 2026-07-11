import React, { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth";
import { getToken, removeToken } from "../services/api";
import { profileService } from "../services/profileService";

export const AuthContext = createContext();

const USER_STORAGE_KEY = "barter_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ──────────────────────────────────────────────
  // Check for existing session on app load
  // If a JWT token exists, fetch the user profile from the API.
  // Falls back to cached localStorage user if the API call fails.
  // ──────────────────────────────────────────────
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Try to fetch fresh profile from backend
      try {
        const profileData = await profileService.getProfile();
        const freshUser = profileData.user || profileData;
        setUser(freshUser);

        // Update cached copy
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
      } catch {
        // API failed (server down, token expired, etc.)
        // Fall back to cached user data
        const cached = localStorage.getItem(USER_STORAGE_KEY);
        if (cached) {
          setUser(JSON.parse(cached));
        } else {
          // No cache either — clear everything
          removeToken();
          setUser(null);
        }
      }
    } catch {
      removeToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ──────────────────────────────────────────────
  // Login: calls real POST /api/auth/login
  // authService.loginUser stores the JWT via setToken()
  // ──────────────────────────────────────────────
  const login = async (username, password, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await authService.loginUser(username, password);

      // The backend returns { token, user } or { token, ...userData }
      const loggedUser = res.user || {
        id: res.id || res._id,
        username: res.username || username,
        name: res.name || username,
        email: res.email || "",
        avatar: res.avatar || "",
        role: res.role || "User",
        rating: res.rating || 0,
        completedTrades: res.completedTrades || 0,
        pendingTrades: res.pendingTrades || 0,
        listingCount: res.listingCount || 0,
        joinDate: res.joinDate || new Date().toLocaleDateString(),
        phone: res.phone || "",
        department: res.department || "",
      };

      setUser(loggedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));

      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Logout: clears JWT + cached user
  // ──────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logoutUser();
      setUser(null);
      removeToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Registration: calls real POST /api/auth/register
  // ──────────────────────────────────────────────
  const register = async (username, password, email) => {
    setLoading(true);
    try {
      const res = await authService.registerUser(username, password, email);
      return res;
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Profile update (placeholder — backend not ready)
  // ──────────────────────────────────────────────
  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const res = await authService.updateUser(user?.id || user?._id, {
        ...user,
        ...updatedData
      });
      const updatedUser = res.user || { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateProfile,
        checkAuth,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;