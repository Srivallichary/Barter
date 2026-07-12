import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyItemsPage from "./pages/MyItemsPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import TradesPage from "./pages/TradesPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/my-items" element={<ProtectedRoute><MyItemsPage /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/trades" element={<ProtectedRoute><TradesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;